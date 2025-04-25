<?php
class TravelPackage extends Controller {

    private $travelPackageModel;

    private $uploadDir = 'uploads/packages/'; // Đường dẫn đến thư mục upload
    private $publicDir = __DIR__ . '/../../public/'; // Đường dẫn đến thư mục public

    public function __construct() {
        $this->travelPackageModel = $this->model('TravelPackageModel'); // Khởi tạo model
        // Tạo thư mục upload nếu chưa tồn tại
        $absoluteUploadDir = $this->publicDir . $this->uploadDir; // path: public/uploads/packages/
        if (!file_exists($absoluteUploadDir)) {
            mkdir($absoluteUploadDir, 0777, true); // Cấp quyền ghi
        }
    }


    private function handleImageUpload($fileInputName = 'package_image') {
        // lấy cái name của thẻ <input type="file" name="package_image">
        // nếu có file và không có lỗi upload
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES[$fileInputName]['tmp_name'];
            $fileName = $_FILES[$fileInputName]['name']; // tên gốc của file
            $fileSize = $_FILES[$fileInputName]['size'];
            $fileType = $_FILES[$fileInputName]['type'];
            $fileNameCmps = explode(".", $fileName); // anhdep.jpg -> ['anhdep', 'jpg']
            $fileExtension = strtolower(end($fileNameCmps)); // lấy phần mở rộng của file (jpg, png, ...)

            // Tạo tên file duy nhất để tránh trùng lặp
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $allowedfileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'webp'];

            // nếu đúng định dạng
            if (in_array($fileExtension, $allowedfileExtensions)) {
                // Đường dẫn đến thư mục upload
                $dest_path = $this->publicDir . $this->uploadDir . $newFileName;
                // di chuyển file từ tmp đến thư mục upload
                if(move_uploaded_file($fileTmpPath, $dest_path)) {
                    // nếu di chuyển thành công, trả về đường dẫn tương đối của file ảnh đã lưu
                    // vd: /uploads/packages/e10adc3949ba59abbe56e057f20f883e.jpg.
                    // đường dẫn này dùng để lưu vào database hoặc hiển thị ảnh trên web.
                    return '/' . $this->uploadDir . $newFileName;
                } else {
                    throw new Exception('Error moving uploaded file.');
                }
            } else {
                throw new Exception('Upload failed. Allowed file types: ' . implode(',', $allowedfileExtensions));
            }
        } elseif (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_NO_FILE) {
            // Nếu có lỗi upload khác ngoài việc không có file được chọn
            throw new Exception('File upload error: ' . $_FILES[$fileInputName]['error']);
        }
        // Không có file mới được upload
        return null;
    }

    // validate dữ liệu
    private function validatePackageData($data, $isUpdate = false) {
        // bắt buộc name và description
        $required_fields = [
            'package_name',
            'package_description'
        ];

        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                $missing_fields[] = $field;
            }
        }

        // chỉ bắt buộc image khi add, update không bắt buộc
        $hasUploadedFile = isset($_FILES['package_image']) && $_FILES['package_image']['error'] === UPLOAD_ERR_OK;
        $hasExistingImage = isset($data['existing_image']) && !empty($data['existing_image']);

        if (!$isUpdate && !$hasUploadedFile) {
            $missing_fields[] = 'package_image';
        }

        // nếu thiếu các field bắt buộc
        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }

        return true;
    }

    // lấy hết packages
    public function index() {
        try {
            $packages = $this->travelPackageModel->getAllTravelPackages();
            $this->jsonResponse(200, 'Success', $packages);
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }


    // lấy package theo id
    public function getById($id) {
        // Kiểm tra xem ID có hợp lệ không
         if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Error', 'Invalid ID format');
            return;
        }
        try {
            $package = $this->travelPackageModel->getTravelPackageById($id);
            if ($package) {
                $this->jsonResponse(200, 'Success', $package);
            } else {
                $this->jsonResponse(404, 'Error', 'Package not found');
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }


    // thêm package
    public function create() {
        $data = $_POST; // Lấy dữ liệu từ form-data
        $imagePath = null;

        try {
            // Validate dữ liệu cơ bản trước khi upload ảnh
            $this->validatePackageData($data, false); // false vì đây là create

            // upload ảnh
            $imagePath = $this->handleImageUpload('package_image'); // Tên input file từ frontend
            if (!$imagePath) {
                 throw new Exception("Image upload failed or no image provided.");
            }

            // Gọi model để thêm vào DB
            $result = $this->travelPackageModel->addTravelPackage(
                $imagePath, // Đường dẫn tương đối đã lưu
                $data['package_name'],
                $data['package_description']
            );

            if ($result) {
                $this->jsonResponse(201, 'Package created successfully'); // 201 Created
            } else {
                // Nếu lỗi DB, xóa ảnh đã upload
                if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                throw new Exception('Failed to create package in database.');
            }
        } catch (Exception $e) {
            // Xóa ảnh đã upload nếu có lỗi xảy ra
            if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                unlink($this->publicDir . ltrim($imagePath, '/'));
            }
            $this->jsonResponse(400, 'Error', $e->getMessage()); // 400 Bad Request
        }
    }

    public function update($id) {
         if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Error', 'Invalid ID format');
            return;
        }

        $data = $_POST;
        $newImagePath = null;

        try {
            // Lấy thông tin package cũ để biết ảnh cũ là gì
            $existingPackage = $this->travelPackageModel->getTravelPackageById($id);
            if (!$existingPackage) {
                throw new Exception("Package not found.");
            }
            $oldImagePath = $existingPackage['package_image']; // Đường dẫn cũ

            // Thêm ảnh cũ vào data để validate
            $data['existing_image'] = $oldImagePath;

            // Validate dữ liệu (true vì đây là update)
            $this->validatePackageData($data, true);

            // Xử lý upload ảnh mới (nếu có)
            $newImagePath = $this->handleImageUpload('package_image');

            // Xác định đường dẫn ảnh cuối cùng để lưu vào DB
            $finalImagePath = $newImagePath ?? $oldImagePath; // Ưu tiên ảnh mới, nếu không có thì giữ ảnh cũ

            // Gọi model để cập nhật
            $result = $this->travelPackageModel->modifyTravelPackage(
                $id,
                $finalImagePath,
                $data['package_name'],
                $data['package_description']
            );

            if ($result) {
                // Nếu cập nhật thành công VÀ có ảnh mới được upload VÀ có ảnh cũ khác ảnh mới -> xóa ảnh cũ
                if ($newImagePath !== null && $oldImagePath && $oldImagePath !== $newImagePath && file_exists($this->publicDir . ltrim($oldImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($oldImagePath, '/'));
                }
                $this->jsonResponse(200, 'Package updated successfully');
            } else {
                // Nếu update DB lỗi nhưng đã upload ảnh mới, xóa ảnh mới đi
                 if ($newImagePath !== null && file_exists($this->publicDir . ltrim($newImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($newImagePath, '/'));
                }
                throw new Exception('Failed to update package in database.');
            }
        } catch (Exception $e) {
             // Xóa ảnh mới đã upload nếu có lỗi xảy ra
            if ($newImagePath !== null && file_exists($this->publicDir . ltrim($newImagePath, '/'))) {
                unlink($this->publicDir . ltrim($newImagePath, '/'));
            }
            $this->jsonResponse(400, 'Error', $e->getMessage());
        }
    }

    public function delete() {
         // Lấy ID từ query parameter
        if (!isset($_GET['id']) || !filter_var($_GET['id'], FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Error', 'Invalid or missing ID parameter');
            return;
        }
        $id = $_GET['id'];


        try {
            // Lấy thông tin package để xóa ảnh
            $package = $this->travelPackageModel->getTravelPackageById($id);
            if (!$package) {
                throw new Exception("Package not found.");
            }
            $imagePath = $package['package_image'];

            // Gọi model để xóa
            $result = $this->travelPackageModel->deleteTravelPackage($id);

            if ($result) {
                // Nếu xóa DB thành công và có ảnh, xóa file ảnh
                if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                $this->jsonResponse(200, 'Package deleted successfully');
            } else {
                throw new Exception('Failed to delete package from database.');
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage()); // 500 Internal Server Error hoặc 404 nếu không tìm thấy
        }
    }

    public function manage(){
        if(!defined('BASE_URL')) {
            define('BASE_URL', base_url());
        }
        if(!defined('BASEURL')) {
            define('BASEURL', base_url());
        }
        $data = [
            'base_url' => base_url(),
        ];
        $this->view('travel_package', $data);
    }


}
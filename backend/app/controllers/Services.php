<?php
class Services extends Controller {
    private $ServicesModel;
    // Định nghĩa thư mục upload ảnh (tương đối từ thư mục public)
    private $uploadDir = 'uploads/services/';
    private $publicDir = __DIR__ . '/../../public/'; // Đường dẫn tuyệt đối đến thư mục public

    public function __construct() {
        $this->servicesModel = $this->model('ServicesModel');
        // Tạo thư mục upload nếu chưa tồn tại
        $absoluteUploadDir = $this->publicDir . $this->uploadDir;
        if (!file_exists($absoluteUploadDir)) {
            mkdir($absoluteUploadDir, 0777, true); // Cấp quyền ghi
        }
    }

    private function validateServicesData($data) {
        $required_fields = [
            'service_title',
            'service_description',
            // 'service_image'  // Không cần kiểm tra ở đây vì sẽ kiểm tra trong hàm handleImageUpload
        ];

        // Kiểm tra các trường bắt buộc trong $_POST (title và description)
        $missing_fields = [];
        foreach ($required_fields as $field) {
            // Sử dụng isset vì giá trị có thể là '0' hoặc rỗng nhưng vẫn tồn tại
            if (!isset($data[$field]) || $data[$field] === '') {
                 $missing_fields[] = $field;
            }
        }
         // Kiểm tra image khi create
        if (!isset($data['id']) && (!isset($data['service_image']) || empty($data['service_image']))) { // Nếu là create (ko có id) và ko có image
             $missing_fields[] = 'service_image';
        }

        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }
        return true;
    }

    public function index() {
        try {
            $service = $this->servicesModel->getAllServices();
            $this->jsonResponse(200, 'Success', $service);
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function getById($id) {
        try {
            $service = $this->servicesModel->getServiceById($id);
            if($service) {
                $this->jsonResponse(200, 'Success', $service);
            } else {
                $this->jsonResponse(404, 'Service not found', null);
            }
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    private function handleImageUpload($fileInputName = 'service_image') {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES[$fileInputName]['tmp_name'];
            $fileName = $_FILES[$fileInputName]['name'];
            $fileSize = $_FILES[$fileInputName]['size'];
            $fileType = $_FILES[$fileInputName]['type'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));

            // Tạo tên file duy nhất để tránh trùng lặp
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $allowedfileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'webp'];

            if (in_array($fileExtension, $allowedfileExtensions)) {
                // Đường dẫn lưu file tuyệt đối
                $dest_path = $this->publicDir . $this->uploadDir . $newFileName;

                if(move_uploaded_file($fileTmpPath, $dest_path)) {
                    // Trả về đường dẫn tương đối để lưu vào DB và sử dụng ở frontend
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

    public function create() {
        $data = $_POST;

        // Xử lý upload ảnh
        try {
            $imagePath = $this->handleImageUpload('service_image');
            if (!$imagePath) {
                 throw new Exception("Image is required for creating a new service.");
            }

            // Gán đường dẫn ảnh vào dữ liệu
            $data['service_image'] = $imagePath;

            // Validate dữ liệu (cần điều chỉnh để phù hợp với $_POST)
            $this->validateServicesData($data);

            // Gọi model để thêm
            $result = $this->servicesModel->addService(
                $data['service_image'],
                $data['service_title'],
                $data['service_description']
            );

            if ($result) {
                $this->jsonResponse(201, 'Service created successfully');
            } else {
                throw new Exception('Failed to create service in database.');
            }
        } catch (Exception $e) {
            // Xóa file đã upload nếu có lỗi xảy ra sau khi upload thành công
            if (isset($imagePath) && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                unlink($this->publicDir . ltrim($imagePath, '/'));
            }
            $this->jsonResponse(400, 'Error', $e->getMessage());
        }
    }

    public function delete($id = null) {
        if(!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid service id', null);
            return;
        }
        if (!$id) {
            $id = $_GET['id'] ?? null;
        }
        if (!$id) {
            $this->jsonResponse(400, 'Missing service id', null);
            return;
        }
        try {
            // Kiểm tra service có tồn tại không
            $service = $this->servicesModel->getServiceById($id);
            if (!$service) {
                $this->jsonResponse(404, 'Service not found', null);
                return;
            }

            $result = $this->servicesModel->deleteService($id);
            if ($result) {
                $this->jsonResponse(200, 'Deleted successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to delete service', null);
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function update($id) {
        $data = $_POST;
        $imagePath = null; // Khởi tạo imagePath

        try {
            // Lấy thông tin servicce cũ để có thể xóa ảnh cũ nếu cần
            $existingService = $this->servicesModel->getServiceById($id);
            if (!$existingService) {
                throw new Exception("Service not found.");
            }
            $oldImagePath = $existingService['service_image']; // Giả sử cột lưu đường dẫn tương đối

            // Xử lý upload ảnh mới (nếu có)
            $imagePath = $this->handleImageUpload('service_image'); // 'service_image' là name của input file

            // Nếu không có ảnh mới được upload, giữ lại ảnh cũ
            if ($imagePath === null) {
                $data['service_image'] = $oldImagePath;
            } else {
                 $data['service_image'] = $imagePath;
            }

            // Validate dữ liệu
             $this->validateServicesData($data);

            // Gọi model để cập nhật
            $result = $this->servicesModel->modifyService(
                $id,
                $data['service_image'],
                $data['service_title'],
                $data['service_description']
            );

            if ($result) {
                 // Nếu upload ảnh mới thành công và có ảnh cũ, xóa ảnh cũ
                if ($imagePath !== null && $oldImagePath && file_exists($this->publicDir . ltrim($oldImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($oldImagePath, '/'));
                }
                $this->jsonResponse(200, 'Service updated successfully');
            } else {
                // Nếu update DB lỗi nhưng đã upload ảnh mới, xóa ảnh mới đi
                 if ($imagePath !== null && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                throw new Exception('Failed to update service in database.');
            }
        } catch (Exception $e) {
             // Xóa ảnh mới đã upload nếu có lỗi xảy ra
            if ($imagePath !== null && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                unlink($this->publicDir . ltrim($imagePath, '/'));
            }
            $this->jsonResponse(400, 'Error', $e->getMessage());
        }
    }
}
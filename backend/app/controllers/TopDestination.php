<?php
class TopDestination extends Controller {
    private $topDestinationModel;
    // Định nghĩa thư mục upload ảnh (tương đối từ thư mục public)
    private $uploadDir = 'uploads/destinations/';
    private $publicDir = __DIR__ . '/../../public/'; // Đường dẫn tuyệt đối đến thư mục public

    public function __construct() {
        $this->topDestinationModel = $this->model('TopDestinationModel');
        // Tạo thư mục upload nếu chưa tồn tại
        $absoluteUploadDir = $this->publicDir . $this->uploadDir;
        if (!file_exists($absoluteUploadDir)) {
            mkdir($absoluteUploadDir, 0777, true); // Cấp quyền ghi
        }
    }

    private function validateDestinationData($data) {
        $required_fields = [
            // 'destination_image', // Không bắt buộc phải có trong data nếu là update và không đổi ảnh
            'destination_name',
            'destination_country',
            'destination_price',
            'destination_description',
            'destination_begin',
            'destination_end',
            'destination_offer',
            'destination_category'
        ];

        // Kiểm tra các trường bắt buộc trong $_POST
        $missing_fields = [];
        foreach ($required_fields as $field) {
            // Sử dụng isset vì giá trị có thể là '0' hoặc rỗng nhưng vẫn tồn tại
            if (!isset($data[$field]) || $data[$field] === '') {
                 $missing_fields[] = $field;
            }
        }
         // Kiểm tra image chỉ khi tạo mới hoặc khi có file được upload lúc update
        if (!isset($data['id']) && (!isset($data['destination_image']) || empty($data['destination_image']))) { // Nếu là create (ko có id) và ko có image
             $missing_fields[] = 'destination_image';
        }


        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }

        // Validate price là số và lớn hơn 0
        if (!is_numeric($data['destination_price']) || $data['destination_price'] <= 0) {
            throw new Exception("Price must be a number greater than zero");
        }

        // Validate dates
        $begin = strtotime($data['destination_begin']);
        $end = strtotime($data['destination_end']);
        $today = strtotime('today'); // Lấy timestamp của đầu ngày hôm nay

        if (!$begin || !$end) {
            throw new Exception("Invalid date format. Please use YYYY-MM-DD.");
        }

        // Kiểm tra ngày bắt đầu < ngày kết thúc
        if ($begin >= $end) {
            throw new Exception("Begin date must be before end date");
        }

        // Kiểm tra ngày bắt đầu không nằm trong quá khứ (chỉ khi tạo mới)
        // Khi update có thể ngày bắt đầu đã qua nhưng vẫn cho phép sửa thông tin khác
        if (!isset($data['id']) && $begin < $today) {
             throw new Exception("Begin date cannot be in the past for new destinations");
        }


        return true;
    }

    public function index() {
        try {
            $destination = $this->topDestinationModel->getAllTopDestination();
            $this->jsonResponse(200, 'Success', $destination);
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function getById($id) {
        try {
            $destination = $this->topDestinationModel->getAllTopDestinationById($id);
            if($destination) {
                $this->jsonResponse(200, 'Success', $destination);
            } else {
                $this->jsonResponse(404, 'Destination not found', null);
            }
        } catch(Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    private function handleImageUpload($fileInputName = 'destination_image') {
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
         // Quan trọng: Không decode JSON vì đang nhận FormData
        // $data = json_decode(file_get_contents("php://input"), true);
        // Thay vào đó, lấy dữ liệu từ $_POST
        $data = $_POST;

        // Xử lý upload ảnh
        try {
            $imagePath = $this->handleImageUpload('destination_image'); // 'destination_image' là name của input file
            if (!$imagePath) {
                 throw new Exception("Image is required for creating a new destination.");
            }

            // Gán đường dẫn ảnh vào dữ liệu
            $data['destination_image'] = $imagePath;

            // Validate dữ liệu (cần điều chỉnh để phù hợp với $_POST)
            $this->validateDestinationData($data); // Đảm bảo hàm này hoạt động với $_POST

            // Gọi model để thêm
            $result = $this->topDestinationModel->addTopDestination(
                $data['destination_image'],
                $data['destination_name'],
                $data['destination_country'],
                $data['destination_price'],
                $data['destination_description'],
                $data['destination_begin'],
                $data['destination_end'],
                $data['destination_offer'],
                $data['destination_category']
            );

            if ($result) {
                $this->jsonResponse(201, 'Destination created successfully');
            } else {
                throw new Exception('Failed to create destination in database.');
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
        // If $id is not provided via routing, check the query string
        if (!$id) {
            $id = $_GET['id'] ?? null;
        }
        if (!$id) {
            $this->jsonResponse(400, 'Missing destination id', null);
            return;
        }
        try {
            // Kiểm tra destination tồn tại
            $destination = $this->topDestinationModel->getAllTopDestinationById($id);
            if (!$destination) {
                $this->jsonResponse(404, 'Destination not found', null);

                return;
            }

            $result = $this->topDestinationModel->deleteTopDestination($id);
            if ($result) {
                $this->jsonResponse(200, 'Deleted successfully!', null);
            } else {
                $this->jsonResponse(500, 'Failed to delete destination', null);
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    public function update($id) {
        // Lấy dữ liệu từ $_POST thay vì JSON
        $data = $_POST;
        $imagePath = null; // Khởi tạo imagePath

        try {
            // Lấy thông tin destination cũ để có thể xóa ảnh cũ nếu cần
            $existingDestination = $this->topDestinationModel->getAllTopDestinationById($id);
            if (!$existingDestination) {
                throw new Exception("Destination not found.");
            }
            $oldImagePath = $existingDestination['destination_image']; // Giả sử cột lưu đường dẫn tương đối

            // Xử lý upload ảnh mới (nếu có)
            $imagePath = $this->handleImageUpload('destination_image'); // 'destination_image' là name của input file

            // Nếu không có ảnh mới được upload, giữ lại ảnh cũ
            if ($imagePath === null) {
                $data['destination_image'] = $oldImagePath;
            } else {
                 $data['destination_image'] = $imagePath;
            }

            // Validate dữ liệu
             $this->validateDestinationData($data); // Đảm bảo hàm này hoạt động với $_POST

            // Gọi model để cập nhật
            $result = $this->topDestinationModel->modifyTopDestination(
                $id,
                $data['destination_image'],
                $data['destination_name'],
                $data['destination_country'],
                $data['destination_price'],
                $data['destination_description'],
                $data['destination_begin'],
                $data['destination_end'],
                $data['destination_offer'],
                $data['destination_category']
            );

            if ($result) {
                 // Nếu upload ảnh mới thành công và có ảnh cũ, xóa ảnh cũ
                if ($imagePath !== null && $oldImagePath && file_exists($this->publicDir . ltrim($oldImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($oldImagePath, '/'));
                }
                $this->jsonResponse(200, 'Destination updated successfully');
            } else {
                // Nếu update DB lỗi nhưng đã upload ảnh mới, xóa ảnh mới đi
                 if ($imagePath !== null && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                throw new Exception('Failed to update destination in database.');
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
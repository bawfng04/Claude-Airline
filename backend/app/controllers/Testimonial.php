<?php
class Testimonial extends Controller {
    private $testimonialModel;
    private $uploadDir = 'uploads/testimonials/';
    private $publicDir = __DIR__ . '/../../public/';

    public function __construct() {
        $this->testimonialModel = $this->model('TestimonialModel');
        $absoluteUploadDir = $this->publicDir . $this->uploadDir;
        if (!file_exists($absoluteUploadDir)) {
            mkdir($absoluteUploadDir, 0777, true);
        }
    }
    private function handleImageUpload($fileInputName = 'user_image') {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES[$fileInputName]['tmp_name'];
            $fileName = $_FILES[$fileInputName]['name'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $allowedfileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'webp'];

            if (in_array($fileExtension, $allowedfileExtensions)) {
                $dest_path = $this->publicDir . $this->uploadDir . $newFileName;
                if(move_uploaded_file($fileTmpPath, $dest_path)) {
                    return '/' . $this->uploadDir . $newFileName; // Trả về đường dẫn tương đối
                } else {
                    throw new Exception('Error moving uploaded file.');
                }
            } else {
                throw new Exception('Upload failed. Allowed file types: ' . implode(',', $allowedfileExtensions));
            }
        } elseif (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] !== UPLOAD_ERR_NO_FILE) {
            throw new Exception('File upload error: ' . $_FILES[$fileInputName]['error']);
        }
        return null; // Không có file mới
    }

    // Hàm validate dữ liệu
    private function validateTestimonialData($data, $isUpdate = false) {
        $required_fields = [
            'user_name',
            'user_testimonial',
            'user_stars',
            'user_location'
        ];
        $missing_fields = [];

        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                $missing_fields[] = $field;
            }
        }

        // Kiểm tra user_stars là số từ 1 đến 5
        if (isset($data['user_stars']) && (!filter_var($data['user_stars'], FILTER_VALIDATE_INT) || $data['user_stars'] < 1 || $data['user_stars'] > 5)) {
             throw new Exception("User stars must be an integer between 1 and 5.");
        }


        // Kiểm tra ảnh chỉ bắt buộc khi tạo mới
        $hasUploadedFile = isset($_FILES['user_image']) && $_FILES['user_image']['error'] === UPLOAD_ERR_OK;
        if (!$isUpdate && !$hasUploadedFile) {
            $missing_fields[] = 'user_image';
        }

        if (!empty($missing_fields)) {
            throw new Exception("Missing required fields: " . implode(', ', $missing_fields));
        }

        return true;
    }

    // Lấy tất cả testimonials
    public function index() {
        try {
            $testimonials = $this->testimonialModel->getAllTestimonials();
            $this->jsonResponse(200, 'Success', $testimonials);
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    // Lấy testimonial theo ID
    public function getById($id) {
        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid ID format', null);
            return;
        }
        try {
            $testimonial = $this->testimonialModel->getTestimonialById($id);
            if ($testimonial) {
                $this->jsonResponse(200, 'Success', $testimonial);
            } else {
                $this->jsonResponse(404, 'Testimonial not found', null);
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }

    // Tạo testimonial mới
    public function create() {
        $data = $_POST;
        $imagePath = null;

        try {
            // Validate dữ liệu cơ bản trước
            $this->validateTestimonialData($data, false); // false vì là create

            // Xử lý upload ảnh
            $imagePath = $this->handleImageUpload('user_image');
            if (!$imagePath) {
                throw new Exception("Image upload failed or no image provided.");
            }

            // Gọi model để thêm
            $result = $this->testimonialModel->addTestimonial(
                $data['user_name'],
                $data['user_testimonial'],
                $imagePath,
                $data['user_stars'],
                $data['user_location']
            );

            if ($result) {
                $this->jsonResponse(201, 'Testimonial created successfully');
            } else {
                // Nếu lỗi DB, xóa ảnh đã upload
                if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                throw new Exception('Failed to create testimonial in database.');
            }
        } catch (Exception $e) {
            // Xóa ảnh đã upload nếu có lỗi
            if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                unlink($this->publicDir . ltrim($imagePath, '/'));
            }
            $this->jsonResponse(400, 'Error', $e->getMessage());
        }
    }

    // Cập nhật testimonial
    public function update($id) {
        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid ID format', null);
            return;
        }

        $data = $_POST;
        $newImagePath = null;

        try {
            // Lấy testimonial cũ
            $existingTestimonial = $this->testimonialModel->getTestimonialById($id);
            if (!$existingTestimonial) {
                throw new Exception("Testimonial not found.");
            }
            $oldImagePath = $existingTestimonial['user_image'];

            // Validate dữ liệu (true vì là update)
            $this->validateTestimonialData($data, true);

            // Xử lý upload ảnh mới (nếu có)
            $newImagePath = $this->handleImageUpload('user_image');

            // Xác định đường dẫn ảnh cuối cùng
            $finalImagePath = $newImagePath ?? $oldImagePath;

            // Gọi model để cập nhật
            $result = $this->testimonialModel->modifyTestimonial(
                $id,
                $data['user_name'],
                $data['user_testimonial'],
                $finalImagePath,
                $data['user_stars'],
                $data['user_location']
            );

            if ($result) {
                // Nếu thành công và có ảnh mới, xóa ảnh cũ (nếu khác ảnh mới)
                if ($newImagePath !== null && $oldImagePath && $oldImagePath !== $newImagePath && file_exists($this->publicDir . ltrim($oldImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($oldImagePath, '/'));
                }
                $this->jsonResponse(200, 'Testimonial updated successfully');
            } else {
                // Nếu lỗi DB, xóa ảnh mới đã upload (nếu có)
                if ($newImagePath !== null && file_exists($this->publicDir . ltrim($newImagePath, '/'))) {
                    unlink($this->publicDir . ltrim($newImagePath, '/'));
                }
                throw new Exception('Failed to update testimonial in database.');
            }
        } catch (Exception $e) {
            // Xóa ảnh mới đã upload nếu có lỗi
            if ($newImagePath !== null && file_exists($this->publicDir . ltrim($newImagePath, '/'))) {
                unlink($this->publicDir . ltrim($newImagePath, '/'));
            }
            $this->jsonResponse(400, 'Error', $e->getMessage());
        }
    }

    // Xóa testimonial
    public function delete($id) {
         if (!filter_var($id, FILTER_VALIDATE_INT)) {
            $this->jsonResponse(400, 'Invalid ID format', null);
            return;
        }

        try {
            // Lấy testimonial để xóa ảnh
            $testimonial = $this->testimonialModel->getTestimonialById($id);
            if (!$testimonial) {
                throw new Exception("Testimonial not found.");
            }
            $imagePath = $testimonial['user_image'];

            // Gọi model để xóa
            $result = $this->testimonialModel->deleteTestimonial($id);

            if ($result) {
                // Nếu xóa DB thành công và có ảnh, xóa file ảnh
                if ($imagePath && file_exists($this->publicDir . ltrim($imagePath, '/'))) {
                    unlink($this->publicDir . ltrim($imagePath, '/'));
                }
                $this->jsonResponse(200, 'Testimonial deleted successfully');
            } else {
                throw new Exception('Failed to delete testimonial from database.');
            }
        } catch (Exception $e) {
            $this->jsonResponse(500, 'Error', $e->getMessage());
        }
    }
}
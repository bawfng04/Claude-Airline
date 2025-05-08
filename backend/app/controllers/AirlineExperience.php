<?php
class AirlineExperience extends Controller {
    private $airlineExperienceModel;

    public function __construct() {
        $this->airlineExperienceModel = $this->model('AirlineExperienceModel');
    }

    // Hiển thị danh sách
    public function index() {
        $experiences = $this->airlineExperienceModel->getAllExperiences();
        $data = ['experiences' => $experiences];
        $this->view('airline_experience', $data);
    }

    // Lưu thông tin (Thêm mới hoặc Cập nhật)
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'] ?? null;
            $title = $_POST['title'];
            $descriptions = $_POST['descriptions'] ?? [];
            $image = null;

            // Xử lý upload ảnh
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image']['tmp_name'];
                $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $uploadDir = '../public/uploads/';
                move_uploaded_file($fileTmpPath, $uploadDir . $fileName);
                $image = $fileName;
            }

            if ($id) {
                if ($this->airlineExperienceModel->updateExperience($id, $title, $image, $descriptions)) {
                    $_SESSION['success'] = 'Cập nhật dữ liệu thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật dữ liệu thất bại!';
                }
            } else {
                if ($this->airlineExperienceModel->addExperience($title, $image, $descriptions)) {
                    $_SESSION['success'] = 'Thêm dữ liệu thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm dữ liệu thất bại!';
                }
            }

            header('Location: ' . base_url('airlineexperience'));
        }
    }

    // Xóa bản ghi
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'];
            
            // Kiểm tra ID
            if (empty($id) || !is_numeric($id)) {
                $_SESSION['error'] = 'ID không hợp lệ!';
                header('Location: ' . base_url('achievements'));
                exit();
            }
            
            // Lấy thông tin để xóa ảnh
            $experience = $this->airlineExperienceModel->getExperienceById($id);
            if ($experience && !empty($experience['image'])) {
                $imagePath = '../public/uploads/' . $experience['image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Xóa ảnh khỏi thư mục uploads
                }
            }
            
            
            if ($this->airlineExperienceModel->deleteExperience($id)) {
                $_SESSION['success'] = 'Xóa dữ liệu thành công!';
            } else {
                $_SESSION['error'] = 'Xóa dữ liệu thất bại!';
            }
            header('Location: ' . base_url('airlineexperience'));
        }
    }

    public function getExperienceById() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $id = $_GET['id'] ?? null;
    
            if (!$id || !is_numeric($id)) {
                $this->jsonResponse(400, 'ID không hợp lệ');
                return;
            }
    
            $experience = $this->airlineExperienceModel->getExperienceById($id);
    
            if ($experience) {
                $this->jsonResponse(200, 'success', $experience);
            } else {
                $this->jsonResponse(404, 'Không tìm thấy trải nghiệm');
            }
        }
    }

    public function getExperiences() {
        try {
            $experiences = $this->airlineExperienceModel->getAllExperiencesJSON();
            $this->jsonResponse(200, 'success', $experiences);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
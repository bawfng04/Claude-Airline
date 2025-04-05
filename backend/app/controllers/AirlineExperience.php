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
            $id = $_POST['id'] ?? null;
            $title = $_POST['title'];
            $description = $_POST['description'];
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
                $this->airlineExperienceModel->updateExperience($id, $title, $description, $image);
            } else {
                $this->airlineExperienceModel->addExperience($title, $description, $image);
            }

            header('Location: ' . base_url('airlineexperience'));
        }
    }

    // Xóa bản ghi
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];

            // Lấy thông tin để xóa ảnh
            $experience = $this->airlineExperienceModel->getExperienceById($id);
            if ($experience && !empty($experience['image'])) {
                $imagePath = '../public/uploads/' . $experience['image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Xóa ảnh khỏi thư mục uploads
                }
            }

            $this->airlineExperienceModel->deleteExperience($id);
            header('Location: ' . base_url('airlineexperience'));
        }
    }
}
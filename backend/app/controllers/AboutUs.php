<?php
class AboutUs extends Controller {
    private $aboutUsModel;

    public function __construct() {
        $this->aboutUsModel = $this->model('AboutUsModel');
    }

    // Hiển thị danh sách
    public function index() {
        $aboutUs = $this->aboutUsModel->getAllAboutUs();
        $data = ['aboutUs' => $aboutUs];
        $this->view('about_us', $data);
    }

    // Lưu thông tin (Thêm mới hoặc Cập nhật)
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'] ?? null;
            $title = trim($_POST['title']);
            $content = trim($_POST['content']);

            // Kiểm tra dữ liệu đầu vào
            if (empty($title) || empty($content)) {
                $_SESSION['error'] = 'Vui lòng nhập đầy đủ thông tin!';
                header('Location: ' . base_url('aboutus'));
                exit();
            }

            if ($id) {
                if ($this->aboutUsModel->updateAboutUs($id, $title, $content)) {
                    $_SESSION['success'] = 'Cập nhật thông tin thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật thông tin thất bại!';
                }
            } else {
                if ($this->aboutUsModel->addAboutUs($title, $content)) {
                    $_SESSION['success'] = 'Thêm thông tin mới thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm thông tin mới thất bại!';
                }
            }

            header('Location: ' . base_url('aboutus'));
            exit();
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
                header('Location: ' . base_url('aboutus'));
                exit();
            }

            if ($this->aboutUsModel->deleteAboutUs($id)) {
                $_SESSION['success'] = 'Xóa thông tin thành công!';
            } else {
                $_SESSION['error'] = 'Xóa thông tin thất bại!';
            }

            header('Location: ' . base_url('aboutus'));
            exit();
        }
    }

    public function getAboutUs() {
        try {
            $aboutUs = $this->aboutUsModel->getAllAboutUs();
            $this->jsonResponse(200, 'success', $aboutUs);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
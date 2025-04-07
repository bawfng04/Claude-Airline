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
            $id = $_POST['id'] ?? null;
            $title = $_POST['title'];
            $content = $_POST['content'];

            if ($id) {
                $this->aboutUsModel->updateAboutUs($id, $title, $content);
            } else {
                $this->aboutUsModel->addAboutUs($title, $content);
            }

            header('Location: ' . base_url('aboutus'));
        }
    }

    // Xóa bản ghi
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $this->aboutUsModel->deleteAboutUs($id);
            header('Location: ' . base_url('aboutus'));
        }
    }

    public function getAboutUs() {
        try {
            $aboutUs = $this->aboutUsModel->getAllAboutUs();
            jsonResponse([
                'status' => 'success',
                'data' => $aboutUs
            ]);
        } catch (Exception $e) {
            jsonResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
<?php
class Achievements extends Controller {
    private $achievementModel;

    public function __construct() {
        $this->achievementModel = $this->model('AchievementModel');
    }

    // Hiển thị danh sách thành tựu
    public function index() {
        $achievements = $this->achievementModel->getAllAchievements();
        $data = ['achievements' => $achievements];
        $this->view('achievements', $data);
    }

    // Lưu thông tin (Thêm mới hoặc Cập nhật)
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start(); // Bắt đầu session
            $id = $_POST['id'] ?? null;
            $year = trim($_POST['year']);
            $title = trim($_POST['title']);
            $description = trim($_POST['description']);

            // Kiểm tra dữ liệu đầu vào
            if (empty($year) || empty($title) || empty($description)) {
                $_SESSION['error'] = 'Vui lòng nhập đầy đủ thông tin!';
                header('Location: ' . base_url('achievements'));
                exit();
            }

            // Thêm hoặc cập nhật thành tựu
            if ($id) {
                if ($this->achievementModel->updateAchievement($id, $year, $title, $description)) {
                    $_SESSION['success'] = 'Cập nhật thành tựu thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật thành tựu thất bại!';
                }
            } else {
                if ($this->achievementModel->addAchievement($year, $title, $description)) {
                    $_SESSION['success'] = 'Thêm thành tựu mới thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm thành tựu mới thất bại!';
                }
            }

            header('Location: ' . base_url('achievements'));
            exit();
        }
    }

    // Xóa thành tựu
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start(); // Bắt đầu session
            $id = $_POST['id'];

            // Kiểm tra ID
            if (empty($id) || !is_numeric($id)) {
                $_SESSION['error'] = 'ID không hợp lệ!';
                header('Location: ' . base_url('achievements'));
                exit();
            }

            // Xóa thành tựu
            if ($this->achievementModel->deleteAchievement($id)) {
                $_SESSION['success'] = 'Xóa thành tựu thành công!';
            } else {
                $_SESSION['error'] = 'Xóa thành tựu thất bại!';
            }

            header('Location: ' . base_url('achievements'));
            exit();
        }
    }

    public function getAchievements() {
        try {
            $achievements = $this->achievementModel->getAllAchievements();
            $this->jsonResponse(200, 'success', $achievements);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
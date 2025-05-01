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
            $id = $_POST['id'] ?? null;
            $year = $_POST['year'];
            $title = $_POST['title'];
            $description = $_POST['description'];

            if ($id) {
                $this->achievementModel->updateAchievement($id, $year, $title, $description);
            } else {
                $this->achievementModel->addAchievement($year, $title, $description);
            }

            header('Location: ' . base_url('achievements'));
        }
    }

    // Xóa thành tựu
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $this->achievementModel->deleteAchievement($id);
            header('Location: ' . base_url('achievements'));
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
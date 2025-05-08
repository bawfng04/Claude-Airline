<?php
class CoreValue extends Controller {
    private $coreValueModel;

    public function __construct() {
        $this->coreValueModel = $this->model('CoreValueModel');
    }

    // Hiển thị danh sách giá trị cốt lõi
    public function index() {
        $coreValues = $this->coreValueModel->getAllCoreValues();
        $data = ['coreValues' => $coreValues];
        $this->view('core_value', $data);
    }

    // Lưu thông tin (Thêm mới hoặc Cập nhật)
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'] ?? null;
            $title = trim($_POST['title']);
            $description = trim($_POST['description']);
            $icon = trim($_POST['icon']);

            // Kiểm tra dữ liệu đầu vào
            if (empty($title) || empty($description) || empty($icon)) {
                $_SESSION['error'] = 'Vui lòng nhập đầy đủ thông tin!';
                header('Location: ' . base_url('corevalue'));
                exit();
            }

            if ($id) {
                if ($this->coreValueModel->updateCoreValue($id, $title, $description, $icon)) {
                    $_SESSION['success'] = 'Cập nhật giá trị cốt lõi thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật giá trị cốt lõi thất bại!';
                }
            } else {
                if ($this->coreValueModel->addCoreValue($title, $description, $icon)) {
                    $_SESSION['success'] = 'Thêm giá trị cốt lõi mới thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm giá trị cốt lõi mới thất bại!';
                }
            }

            header('Location: ' . base_url('corevalue'));
            exit();
        }
    }

    // Xóa giá trị cốt lõi
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'];

            // Kiểm tra ID
            if (empty($id) || !is_numeric($id)) {
                $_SESSION['error'] = 'ID không hợp lệ!';
                header('Location: ' . base_url('corevalue'));
                exit();
            }

            if ($this->coreValueModel->deleteCoreValue($id)) {
                $_SESSION['success'] = 'Xóa giá trị cốt lõi thành công!';
            } else {
                $_SESSION['error'] = 'Xóa giá trị cốt lõi thất bại!';
            }

            header('Location: ' . base_url('corevalue'));
            exit();
        }
    }

    public function getCoreValues() {
        try {
            $coreValues = $this->coreValueModel->getAllCoreValues();
            $this->jsonResponse(200, 'success', $coreValues);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
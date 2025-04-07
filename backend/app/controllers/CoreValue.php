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
            $id = $_POST['id'] ?? null;
            $title = $_POST['title'];
            $description = $_POST['description'];
            $icon = $_POST['icon']; // Lấy text của icon từ form
    
            if ($id) {
                $this->coreValueModel->updateCoreValue($id, $title, $description, $icon);
            } else {
                $this->coreValueModel->addCoreValue($title, $description, $icon);
            }
    
            header('Location: ' . base_url('corevalue'));
        }
    }

    // Xóa giá trị cốt lõi
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];

            // Kiểm tra xem bản ghi có tồn tại không
            if (!$this->coreValueModel->coreValueExists($id)) {
                die("Giá trị cốt lõi không tồn tại.");
            }

            // Lấy thông tin để xóa icon
            $coreValue = $this->coreValueModel->getCoreValueById($id);
            if ($coreValue && !empty($coreValue['icon'])) {
                $iconPath = '../public/uploads/' . $coreValue['icon'];
                if (file_exists($iconPath)) {
                    unlink($iconPath); // Xóa icon khỏi thư mục uploads
                }
            }

            $this->coreValueModel->deleteCoreValue($id);
            header('Location: ' . base_url('corevalue'));
        }
    }

    public function getCoreValues() {
        try {
            $coreValues = $this->coreValueModel->getAllCoreValues();
            jsonResponse([
                'status' => 'success',
                'data' => $coreValues
            ]);
        } catch (Exception $e) {
            jsonResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
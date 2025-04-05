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
            $icon = null;

            // Xử lý upload icon
            if (isset($_FILES['icon']) && $_FILES['icon']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['icon']['tmp_name'];
                $fileName = uniqid() . '.' . pathinfo($_FILES['icon']['name'], PATHINFO_EXTENSION);
                $uploadDir = '../public/uploads/';
                if (move_uploaded_file($fileTmpPath, $uploadDir . $fileName)) {
                    $icon = $fileName;
                } else {
                    die("Không thể tải lên icon.");
                }
            }

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
}
<?php
class AirlineFleet extends Controller {
    private $airlineFleetModel;

    public function __construct() {
        $this->airlineFleetModel = $this->model('AirlineFleetModel');
    }

    // Hiển thị danh sách máy bay
    public function index() {
        $aircrafts = $this->airlineFleetModel->getAllAircrafts();
        $data = ['aircrafts' => $aircrafts];
        $this->view('airline_fleet', $data);
    }

    // Lưu thông tin (Thêm mới hoặc Cập nhật)
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'] ?? null;
            $aircraft_model = trim($_POST['aircraft_model']);
            $description = trim($_POST['description']);
            $image = null;

            // Kiểm tra dữ liệu đầu vào
            if (empty($aircraft_model) || empty($description)) {
                $_SESSION['error'] = 'Vui lòng nhập đầy đủ thông tin!';
                header('Location: ' . base_url('airlinefleet'));
                exit();
            }

            // Xử lý upload hình ảnh
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image']['tmp_name'];
                $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $uploadDir = '../public/uploads/';
                if (move_uploaded_file($fileTmpPath, $uploadDir . $fileName)) {
                    $image = $fileName;
                } else {
                    $_SESSION['error'] = 'Không thể tải lên hình ảnh.';
                    header('Location: ' . base_url('airlinefleet'));
                    exit();
                }
            }

            if ($id) {
                if ($this->airlineFleetModel->updateAircraft($id, $aircraft_model, $description, $image)) {
                    $_SESSION['success'] = 'Cập nhật máy bay thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật máy bay thất bại!';
                }
            } else {
                if ($this->airlineFleetModel->addAircraft($aircraft_model, $description, $image)) {
                    $_SESSION['success'] = 'Thêm máy bay mới thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm máy bay mới thất bại!';
                }
            }

            header('Location: ' . base_url('airlinefleet'));
            exit();
        }
    }

    // Xóa máy bay
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'];

            // Kiểm tra ID
            if (empty($id) || !is_numeric($id)) {
                $_SESSION['error'] = 'ID không hợp lệ!';
                header('Location: ' . base_url('airlinefleet'));
                exit();
            }

            // Lấy thông tin để xóa hình ảnh
            $aircraft = $this->airlineFleetModel->getAircraftById($id);
            if ($aircraft && !empty($aircraft['image'])) {
                $imagePath = '../public/uploads/' . $aircraft['image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            if ($this->airlineFleetModel->deleteAircraft($id)) {
                $_SESSION['success'] = 'Xóa máy bay thành công!';
            } else {
                $_SESSION['error'] = 'Xóa máy bay thất bại!';
            }

            header('Location: ' . base_url('airlinefleet'));
            exit();
        }
    }
    public function getFleets() {
        try {
            $aircrafts = $this->airlineFleetModel->getAllAircrafts();
            $this->jsonResponse(200, 'success', $aircrafts);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
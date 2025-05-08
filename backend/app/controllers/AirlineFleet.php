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
            $id = $_POST['id'] ?? null;
            $aircraft_model = $_POST['aircraft_model'];
            $description = $_POST['description'];
            $image = null;

            // Xử lý upload hình ảnh
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image']['tmp_name'];
                $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $uploadDir = '../public/uploads/';
                if (move_uploaded_file($fileTmpPath, $uploadDir . $fileName)) {
                    $image = $fileName;
                } else {
                    die("Không thể tải lên hình ảnh.");
                }
            }

            if ($id) {
                $this->airlineFleetModel->updateAircraft($id, $aircraft_model, $description, $image);
            } else {
                $this->airlineFleetModel->addAircraft($aircraft_model, $description, $image);
            }

            header('Location: ' . base_url('airlinefleet'));
        }
    }

    // Xóa máy bay
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];

            // Lấy thông tin để xóa hình ảnh
            $aircraft = $this->airlineFleetModel->getAircraftById($id);
            if ($aircraft && !empty($aircraft['image'])) {
                $imagePath = '../public/uploads/' . $aircraft['image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Xóa hình ảnh khỏi thư mục uploads
                }
            }

            $this->airlineFleetModel->deleteAircraft($id);
            header('Location: ' . base_url('airlinefleet'));
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
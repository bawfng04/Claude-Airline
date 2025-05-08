<?php
class LeadershipTeam extends Controller {
    private $leadershipTeamModel;

    public function __construct() {
        $this->leadershipTeamModel = $this->model('LeadershipTeamModel');
    }

    public function index() {
        $members = $this->leadershipTeamModel->getAllMembers();
        $data = ['members' => $members];
        $this->view('leadership_team', $data);
    }

    public function save() {
        session_start(); // Bắt đầu session
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'] ?? null;
            $name = trim($_POST['name']);
            $position = trim($_POST['position']);
            $bio = trim($_POST['bio']);
            $image = null;
    
            // Kiểm tra dữ liệu đầu vào
            if (empty($name) || empty($position) || empty($bio)) {
                $_SESSION['error'] = 'Vui lòng nhập đầy đủ thông tin!';
                header('Location: ' . base_url('leadershipteam'));
                exit();
            }
    
            // Xử lý upload ảnh
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image']['tmp_name'];
                $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $uploadDir = '../public/uploads/';
                if (!move_uploaded_file($fileTmpPath, $uploadDir . $fileName)) {
                    $_SESSION['error'] = 'Không thể tải lên ảnh.';
                    header('Location: ' . base_url('leadershipteam'));
                    exit();
                }
                $image = $fileName;
            }
    
            // Thêm hoặc cập nhật thành viên
            if ($id) {
                if ($this->leadershipTeamModel->updateMember($id, $name, $position, $bio, $image)) {
                    $_SESSION['success'] = 'Cập nhật thành viên thành công!';
                } else {
                    $_SESSION['error'] = 'Cập nhật thành viên thất bại!';
                }
            } else {
                if ($this->leadershipTeamModel->addMember($name, $position, $bio, $image)) {
                    $_SESSION['success'] = 'Thêm thành viên mới thành công!';
                } else {
                    $_SESSION['error'] = 'Thêm thành viên mới thất bại!';
                }
            }
    
            header('Location: ' . base_url('leadershipteam'));
            exit();
        }
    }
    
    public function delete() {
        session_start(); // Bắt đầu session
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
    
            // Kiểm tra ID
            if (empty($id) || !is_numeric($id)) {
                $_SESSION['error'] = 'ID không hợp lệ.';
                header('Location: ' . base_url('leadershipteam'));
                exit();
            }
    
            // Lấy thông tin thành viên để kiểm tra ảnh
            $member = $this->leadershipTeamModel->getMemberById($id);
            if ($member && !empty($member['image'])) {
                $imagePath = '../public/uploads/' . $member['image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Xóa ảnh khỏi thư mục uploads
                }
            }
    
            // Xóa thành viên khỏi cơ sở dữ liệu
            if ($this->leadershipTeamModel->deleteMember($id)) {
                $_SESSION['success'] = 'Xóa thành viên thành công!';
            } else {
                $_SESSION['error'] = 'Xóa thành viên thất bại!';
            }
    
            header('Location: ' . base_url('leadershipteam'));
            exit();
        }
    }

    public function getTeams() {
        try {
            $members = $this->leadershipTeamModel->getAllMembers();
            $this->jsonResponse(200, 'success', $members);
        } catch (Exception $e) {
            $this->jsonResponse(500, $e->getMessage());
        }
    }
}
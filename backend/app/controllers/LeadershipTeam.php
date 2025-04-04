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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'] ?? null;
            $name = $_POST['name'];
            $position = $_POST['position'];
            $bio = $_POST['bio'];
            $image = null;

            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image']['tmp_name'];
                $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $uploadDir = '../public/uploads/';
                move_uploaded_file($fileTmpPath, $uploadDir . $fileName);
                $image = $fileName;
            }

            if ($id) {
                $this->leadershipTeamModel->updateMember($id, $name, $position, $bio, $image);
            } else {
                $this->leadershipTeamModel->addMember($name, $position, $bio, $image);
            }

            header('Location: ' . base_url('leadershipteam'));
        }
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];

            // Lấy thông tin thành viên để kiểm tra ảnh
            $member = $this->leadershipTeamModel->getMemberById($id);
            if ($member && !empty($member['image'])) {
                $imagePath = '../public/uploads/' . $member['image'];
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Xóa ảnh khỏi thư mục uploads
                }
            }

            // Xóa thành viên khỏi cơ sở dữ liệu
            $this->leadershipTeamModel->deleteMember($id);

            // Chuyển hướng về trang danh sách
            header('Location: ' . base_url('leadershipteam'));
        }
    }
}
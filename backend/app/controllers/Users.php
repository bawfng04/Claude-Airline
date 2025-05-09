<?php
require_once __DIR__ . '/../helpers/JwtHelper.php';
require_once __DIR__ . '/../config/env.php';
loadEnv();

class Users extends Controller {
    private $userModel;

    public function __construct() {
        $this->userModel = $this->model('UserModel');
    }

    // Hiển thị danh sách người dùng
    public function index() {
        $users = $this->userModel->getAllUsers();
        $data = ['users' => $users];
        $this->view('users', $data);
    }

    // Thêm hoặc cập nhật người dùng
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = $_POST['id'] ?? null;
            $email = $_POST['email'];

            // Kiểm tra email đã tồn tại
            $existingUser = $this->userModel->getUserByEmail($email);
            if ($existingUser && (!$id || $existingUser['id'] != $id)) {
                // Email đã tồn tại và không phải là user đang cập nhật chính mình
                $_SESSION['js_error'] = 'Email đã tồn tại.';
                header('Location: ' . base_url('users')); // hoặc trang form cụ thể bạn muốn
                exit;
            }

            // Xử lý ảnh đại diện
            $image = $_FILES['image']['name'] ?? null;
            if (!empty($_FILES['image']['tmp_name'])) {
                move_uploaded_file($_FILES['image']['tmp_name'], '../public/uploads/' . $image);
            } else {
                $image = 'defaultImage.jpg'; // ảnh mặc định
            }

            $data = [
                'family_name' => $_POST['family_name'],
                'given_name' => $_POST['given_name'],
                'email' => $email,
                'password' => password_hash($_POST['password'], PASSWORD_DEFAULT),
                'phone_number' => $_POST['phone_number'],
                'birthday' => $_POST['birthday'],
                'nationality' => $_POST['nationality'],
                'membership' => $_POST['membership'],
                'image' => $image,
                'role' => $_POST['role'],
                'active' => isset($_POST['active']) ? 1 : 0
            ];
                
            $this->userModel->addUser($data);

            header('Location: ' . base_url('users'));
        }
    }

    public function toggleStatus() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            $id = isset($_POST['id']) ? trim($_POST['id']) : null;
            $status = isset($_POST['status_action']) ? trim($_POST['status_action']) : null;

            if (!is_numeric($id) || !in_array($status, ['enable', 'disable'])) {
                $_SESSION['error'] = 'Dữ liệu không hợp lệ.';
                header('Location: ' . base_url('users'));
                exit();
            }

            $isActive = $status === 'enable' ? 1 : 0;

            if ($this->userModel->updateUserStatus($id, $isActive)) {
                $_SESSION['success'] = 'Cập nhật trạng thái thành công!';
            } else {
                $_SESSION['error'] = 'Không thể cập nhật trạng thái.';
            }

            header('Location: ' . base_url('users'));
            exit();
        }
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                // Lấy dữ liệu từ request
                $rawInput = file_get_contents("php://input");
                $data = json_decode($rawInput, true);

                // Nếu có lỗi khi parse JSON
                if (!is_array($data)) {
                    $this->jsonResponse(400, 'Dữ liệu gửi lên không hợp lệ!');
                    return;
                }

                // Gán giá trị mặc định nếu thiếu
                $data = array_merge([
                    'family_name' => '',
                    'given_name' => '',
                    'email' => '',
                    'password' => '',
                    'phone_number' => '',
                    'birthday' => '',
                    'nationality' => '',
                    'membership' => null,
                    'image' => null,
                    'role' => 'USER',
                    'active' => 1
                ], $data);

                // Kiểm tra dữ liệu đầu vào
                if (empty($data['family_name']) || empty($data['given_name']) || empty($data['email']) || empty($data['password']) || empty($data['birthday']) || empty($data['nationality'])) {
                    $this->jsonResponse(400, 'error');
                    return;
                }

                // Kiểm tra email đã tồn tại chưa
                if ($this->userModel->getUserByEmail($data['email'])) {
                    $this->jsonResponse(400, 'Email đã được sử dụng!');
                    return;
                }

                // Mã hóa mật khẩu
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

                // Xử lý upload ảnh (nếu có)
                if (!empty($_FILES['image']['tmp_name'])) {
                    $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $uploadDir = '../public/uploads/';
                    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
                        $this->jsonResponse(500, 'Không thể tải lên hình ảnh!');
                        return;
                    }
                    $data['image'] = $fileName;
                }else {
                    $data['image'] = 'defaultImage.jpg';
                }

                // Thêm người dùng vào cơ sở dữ liệu
                if ($this->userModel->addUser($data)) {
                    $this->jsonResponse(200, 'Đăng ký thành công!');
                } else {
                    $this->jsonResponse(500, 'Không thể đăng ký người dùng!');
                }
            } catch (Exception $e) {
                $this->jsonResponse(500, $e->getMessage());
            }
        } else {
            $this->jsonResponse(405, 'Phương thức không được hỗ trợ!');
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                // Lấy dữ liệu từ request
                $rawInput = file_get_contents("php://input");
                $data = json_decode($rawInput, true);

                if (!is_array($data)) {
                    $this->jsonResponse(400, 'Dữ liệu gửi lên không hợp lệ!');
                    return;
                }

                // Lấy email, password và remember
                $email = trim($data['email'] ?? '');
                $password = trim($data['password'] ?? '');
                $remember = $data['remember'] ?? false;

                if (empty($email) || empty($password)) {
                    $this->jsonResponse(400, 'Vui lòng nhập email và mật khẩu!');
                    return;
                }

                // Lấy người dùng từ DB
                $user = $this->userModel->getUserByEmail($email);

                if (!$user) {
                    $this->jsonResponse(404, 'Email không tồn tại!');
                    return;
                }

                // Kiểm tra mật khẩu
                if (!password_verify($password, $user['PASSWORD'])) {
                    $this->jsonResponse(401, 'Mật khẩu không chính xác!');
                    return;
                }

                // Kiểm tra trạng thái tài khoản
                if (!$user['ACTIVE']) {
                    $this->jsonResponse(403, 'Tài khoản của bạn đã bị vô hiệu hóa!');
                    return;
                }

                // ==========================
                // Tạo JWT (thuần PHP)
                // ==========================
                $jwtHelper = new JwtHelper();

                $secret = getenv('JWT_SECRET'); // bạn nên cho vào file cấu hình

                // Thời gian hết hạn token
                $exp = $remember ? (time() + 60 * 60 * 24 * 30) : (time() + 60 * 60 * 2); // 30 ngày hoặc 2 giờ

                $header = [
                    'alg' => 'HS256',
                    'typ' => 'JWT'
                ];

                $payload = [
                    'id' => $user['ID'],
                    'email' => $user['EMAIL'],
                    'exp' => $exp
                ];

                $jwt = $jwtHelper->generateJWT($header, $payload, $secret);

                // ==========================
                // Trả kết quả
                // ==========================
                $this->jsonResponse(200, 'Đăng nhập thành công!',
                    [
                        'role' => $user['ROLE'],
                        'token' => $jwt,
                        'token_expiration' => $exp
                    ]
                );
            } catch (Exception $e) {
                $this->jsonResponse(500, $e->getMessage());
            }
        } else {
            $this->jsonResponse(405, 'Phương thức không được hỗ trợ!');
        }
    }

    // In backend/app/controllers/Users.php
    public function getUserInfo() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                require_once __DIR__ . '/../middlewares/authMiddleware.php';
                authMiddleware(); 

                $userId = $GLOBALS['user_id'] ?? null;

                if (!$userId) {
                    $this->jsonResponse(401, 'Xác thực thất bại hoặc không tìm thấy ID người dùng.');
                    return;
                }

                $user = $this->userModel->getUserById($userId);

                if (!$user) {
                    $this->jsonResponse(404, 'Người dùng không tồn tại.');
                    return;
                }
                
                $userData = [
                    'id'            => $user['ID'], // THIS LINE IS ESSENTIAL
                    'family_name'   => $user['FAMILY_NAME'],
                    'given_name'    => $user['GIVEN_NAME'],
                    'email'         => $user['EMAIL'],
                    'phone_number'  => $user['PHONE_NUMBER'],
                    'birthday'      => $user['BIRTHDAY'],
                    'nationality'   => $user['NATIONALITY'],
                    'membership'    => $user['MEMBERSHIP'],
                    'image'         => $user['image'],
                ];
                
                $this->jsonResponse(200, 'Success', $userData);

            } catch (Exception $e) {
                error_log("Error in getUserInfo: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
                $this->jsonResponse(500, 'Lỗi máy chủ khi lấy thông tin người dùng.');
            }
        } else {
            $this->jsonResponse(405, 'Phương thức không được hỗ trợ!');
        }
    }

    public function editProfile() {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            try {
                require_once __DIR__ . '/../middlewares/authMiddleware.php';
                $authPayload = authMiddleware();

                $userId = $GLOBALS['user_id'];

                if (!$userId) {
                    $this->jsonResponse(401, 'Không tìm thấy người dùng!');
                    return;
                }

                // Lấy thông tin người dùng hiện tại từ cơ sở dữ liệu
                $currentUser = $this->userModel->getUserById($userId);

                if (!$currentUser) {
                    $this->jsonResponse(404, 'Người dùng không tồn tại!');
                    return;
                }

                // Lấy dữ liệu từ request
                $rawInput = file_get_contents("php://input");
                $data = json_decode($rawInput, true);

                if (!is_array($data)) {
                    $this->jsonResponse(400, 'Dữ liệu gửi lên không hợp lệ!');
                    return;
                }

                // Gán giá trị từ dữ liệu mới hoặc giữ nguyên giá trị cũ
                $data = [
                    'family_name' => $data['family_name'] ?? $currentUser['FAMILY_NAME'],
                    'given_name' => $data['given_name'] ?? $currentUser['GIVEN_NAME'],
                    'phone_number' => $data['phone_number'] ?? $currentUser['PHONE_NUMBER'],
                    'birthday' => $data['birthday'] ?? $currentUser['BIRTHDAY'],
                    'nationality' => $data['nationality'] ?? $currentUser['NATIONALITY'],
                    'membership' => $data['membership'] ?? $currentUser['MEMBERSHIP'],
                ];

                // Kiểm tra dữ liệu đầu vào
                if (empty($data['family_name']) || empty($data['given_name']) || empty($data['birthday']) || empty($data['nationality'])) {
                    $this->jsonResponse(400, 'Vui lòng điền đầy đủ thông tin!');
                    return;
                }

                // Cập nhật thông tin người dùng
                if ($this->userModel->updateUser($userId, $data)) {
                    $this->jsonResponse(200, 'Cập nhật thông tin thành công!');
                } else {
                    $this->jsonResponse(500, 'Không thể cập nhật thông tin!');
                }
            } catch (Exception $e) {
                $this->jsonResponse(500, $e->getMessage());
            }
        } else {
            $this->jsonResponse(405, 'Phương thức không được hỗ trợ!');
        }
    }
}
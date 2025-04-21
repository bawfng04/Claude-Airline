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
            $id = $_POST['id'] ?? null;
            $data = [
                'family_name' => $_POST['family_name'],
                'given_name' => $_POST['given_name'],
                'email' => $_POST['email'],
                'password' => password_hash($_POST['password'], PASSWORD_DEFAULT),
                'phone_number' => $_POST['phone_number'],
                'birthday' => $_POST['birthday'],
                'nationality' => $_POST['nationality'],
                'membership' => $_POST['membership'],
                'image' => $_FILES['image']['name'] ?? null,
                'role' => $_POST['role'],
                'active' => isset($_POST['active']) ? 1 : 0
            ];

            // Xử lý upload ảnh
            if (!empty($_FILES['image']['tmp_name'])) {
                move_uploaded_file($_FILES['image']['tmp_name'], '../public/uploads/' . $_FILES['image']['name']);
            }

            if ($id) {
                $this->userModel->updateUser($id, $data);
            } else {
                $this->userModel->addUser($data);
            }

            header('Location: ' . base_url('users'));
        }
    }

    public function toggleStatus() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Dữ liệu gửi lên không hợp lệ!'
                    ], 400);
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
                    jsonResponse([
                        'status' => 'error',
                        'message' => $data
                    ], 400);
                    return;
                }

                // Kiểm tra email đã tồn tại chưa
                if ($this->userModel->getUserByEmail($data['email'])) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Email đã được sử dụng!'
                    ], 400);
                    return;
                }

                // Mã hóa mật khẩu
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

                // Xử lý upload ảnh (nếu có)
                if (!empty($_FILES['image']['tmp_name'])) {
                    $fileName = uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $uploadDir = '../public/uploads/';
                    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
                        jsonResponse([
                            'status' => 'error',
                            'message' => 'Không thể tải lên hình ảnh!'
                        ], 500);
                        return;
                    }
                    $data['image'] = $fileName;
                }

                // Thêm người dùng vào cơ sở dữ liệu
                if ($this->userModel->addUser($data)) {
                    jsonResponse([
                        'status' => 'success',
                        'message' => 'Đăng ký thành công!'
                    ]);
                } else {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Không thể đăng ký người dùng!'
                    ], 500);
                }
            } catch (Exception $e) {
                jsonResponse([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            jsonResponse([
                'status' => 'error',
                'message' => 'Phương thức không được hỗ trợ!'
            ], 405);
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                // Lấy dữ liệu từ request
                $rawInput = file_get_contents("php://input");
                $data = json_decode($rawInput, true);

                if (!is_array($data)) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Dữ liệu gửi lên không hợp lệ!'
                    ], 400);
                    return;
                }

                // Lấy email, password và remember
                $email = trim($data['email'] ?? '');
                $password = trim($data['password'] ?? '');
                $remember = $data['remember'] ?? false;

                if (empty($email) || empty($password)) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Vui lòng nhập email và mật khẩu!'
                    ], 400);
                    return;
                }

                // Lấy người dùng từ DB
                $user = $this->userModel->getUserByEmail($email);

                if (!$user) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Email không tồn tại!'
                    ], 404);
                    return;
                }

                // Kiểm tra mật khẩu
                if (!password_verify($password, $user['PASSWORD'])) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Mật khẩu không chính xác!'
                    ], 401);
                    return;
                }

                // Kiểm tra trạng thái tài khoản
                if (!$user['ACTIVE']) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Tài khoản của bạn đã bị vô hiệu hóa!'
                    ], 403);
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
                jsonResponse([
                    'status' => 'success',
                    'message' => 'Đăng nhập thành công!',
                    'data' => [
                        'role' => $user['ROLE'],
                        'token' => $jwt,
                        'token_expiration' => $exp
                    ]
                ]);
            } catch (Exception $e) {
                jsonResponse([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            jsonResponse([
                'status' => 'error',
                'message' => 'Phương thức không được hỗ trợ!'
            ], 405);
        }
    }

    public function getUserInfo() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                // Gọi middleware xác thực JWT
                require_once __DIR__ . '/../middlewares/authMiddleware.php';
                $authPayload = authMiddleware(); // trả về payload nếu hợp lệ

                // Lấy user_id từ token (đã xác thực)
                $userId = $GLOBALS['user_id'];

                if (!$userId) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Không tìm thấy user_id trong token!'
                    ], 401);
                    return;
                }

                // Lấy thông tin người dùng từ CSDL
                $user = $this->userModel->getUserById($userId);

                if (!$user) {
                    jsonResponse([
                        'status' => 'error',
                        'message' => 'Người dùng không tồn tại!'
                    ], 404);
                    return;
                }

                // Trả về thông tin người dùng
                jsonResponse([
                    'status' => 'success',
                    'data' => [
                        'id' => $user['ID'],
                        'family_name' => $user['FAMILY_NAME'],
                        'given_name' => $user['GIVEN_NAME'],
                        'email' => $user['EMAIL'],
                        'phone_number' => $user['PHONE_NUMBER'],
                        'birthday' => $user['BIRTHDAY'],
                        'nationality' => $user['NATIONALITY'],
                        'membership' => $user['MEMBERSHIP'],
                        'image' => $user['image'],
                    ]
                ]);
            } catch (Exception $e) {
                jsonResponse([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            jsonResponse([
                'status' => 'error',
                'message' => 'Phương thức không được hỗ trợ!'
            ], 405);
        }
    }
}
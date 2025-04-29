<?php
require_once __DIR__ . '/../helpers/JwtHelper.php';

class Home extends Controller {
    public function index() {
        $token = $_GET['token'] ?? '';

        if (!empty($token)) {
            $jwtHelper = new JwtHelper();
            $payload = $jwtHelper->decodeTokenPayload($token);

            if ($payload && isset($payload['exp'])) {
                $exp = $payload['exp'];

                setcookie(
                    'token',
                    $token,
                    [
                        'expires' => $exp,
                        'path' => '/',
                        'secure' => false,
                        'httponly' => true,
                        'samesite' => 'Lax'
                    ]
                );

                    header('Location: ' . base_url(''));
                    exit();
                }

            // Nếu token lỗi thì về login
            header('Location: http://localhost:3000');
            exit();
        }

        $this->view('index');
    }

    public function logout() {
        // Xóa cookie "token"
        if (isset($_COOKIE['token'])) {
            setcookie('token', '', time() - 3600, '/'); // Đặt thời gian hết hạn trong quá khứ
        }

        // Redirect về trang login (hoặc homepage)
        header('Location: http://localhost:3000');
        exit;
    }
}
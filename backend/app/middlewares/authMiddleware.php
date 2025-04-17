<?php
// middleware.php
require_once __DIR__ . '/../config/env.php';
loadEnv();

// Hàm decode Base64 URL-safe
function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

// Hàm xác thực và giải mã JWT
function verifyAndDecodeJWT($jwt, $secret) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;

    list($headerB64, $payloadB64, $signatureB64) = $parts;

    $expectedSignature = hash_hmac('sha256', "$headerB64.$payloadB64", $secret, true);
    $expectedSignatureB64 = rtrim(strtr(base64_encode($expectedSignature), '+/', '-_'), '=');

    if (!hash_equals($expectedSignatureB64, $signatureB64)) return false;

    $payloadJson = base64url_decode($payloadB64);
    $payload = json_decode($payloadJson, true);

    if (!$payload || !isset($payload['exp'])) return false;
    if (time() > $payload['exp']) return false;

    return $payload;
}

// Middleware chính
function authMiddleware() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $jwt = $matches[1];
        $secret = getenv('JWT_SECRET'); 
        $payload = verifyAndDecodeJWT($jwt, $secret);
        if ($payload) {
            // Gán user ID vào biến toàn cục để dùng ở chỗ khác
            $GLOBALS['user_id'] = $payload['id'];
            $GLOBALS['user_email'] = $payload['email'];
            return true;
        }
    }

    // Nếu đến đây là không hợp lệ
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Token không hợp lệ hoặc đã hết hạn!'
    ]);
    exit;
}

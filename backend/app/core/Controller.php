<?php
// app/core/Controller.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


class Controller {
    // Load Model
    public function model($model) {
        // Xác định đường dẫn model
        $modelPath = dirname(__DIR__) . '/models/' . $model . '.php';

        if (file_exists($modelPath)) {
            require_once $modelPath;
            return new $model(); // Khởi tạo model
        } else {
            throw new Exception("Model không tồn tại: " . $modelPath);
        }
    }

    // Load View
    public function view($view, $data = []) {
        // Xác định đường dẫn view
        $viewPath = dirname(__DIR__) . '/views/' . $view . '.php';

        if (file_exists($viewPath)) {
            extract($data); // Truyền dữ liệu sang View dưới dạng biến
            require_once $viewPath;
        } else {
            throw new Exception("View không tồn tại: " . $viewPath);
        }
    }

    protected function jsonResponse($status, $message, $data = null) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
    }
}
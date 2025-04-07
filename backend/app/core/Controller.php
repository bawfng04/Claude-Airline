<?php
// app/core/Controller.php
require_once '../app/helpers/jsonResponse.php';

header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép từ React app
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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
}

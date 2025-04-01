<?php
// public/index.php

// Load Config
require_once '../config/config.php';

// Load Core Classes (Tự động hoặc thủ công)
// Cách đơn giản là require_once từng file core
// require_once '../app/core/Database.php';
// require_once '../app/core/Controller.php';

// Autoload Core Libraries (Optional - Cách xịn hơn)
spl_autoload_register(function($className){
    $corePath = '../app/core/' . $className . '.php';
    if (file_exists($corePath)) {
        require_once $corePath;
    }
});

// --- Routing đơn giản ---

$controllerName = DEFAULT_CONTROLLER; // Controller mặc định
$methodName = DEFAULT_METHOD;     // Method mặc định
$params = [];                     // Tham số truyền vào method

// Parse URL từ biến 'url' mà .htaccess tạo ra
if (isset($_GET['url'])) {
    // Trim dấu / ở cuối, lọc ký tự ko hợp lệ, tách thành mảng bằng dấu /
    $url = rtrim($_GET['url'], '/');
    $url = filter_var($url, FILTER_SANITIZE_URL);
    $url = explode('/', $url);

    // Phần tử 0: Tên Controller
    if (!empty($url[0])) {
        $controllerName = ucwords($url[0]); // Viết hoa chữ cái đầu: home -> Home
        unset($url[0]);
    }

    // Phần tử 1: Tên Method (Action)
    if (isset($url[1])) {
        if (!empty($url[1])) {
            $methodName = $url[1];
            unset($url[1]);
        }
    }

    // Phần còn lại: Tham số
    $params = $url ? array_values($url) : [];
}

// --- Dispatch (Điều phối) ---

// Kiểm tra file Controller có tồn tại không?
$controllerFile = '../app/controllers/' . $controllerName . '.php';
if (file_exists($controllerFile)) {
    require_once $controllerFile;

    // Kiểm tra class Controller có tồn tại không?
    if (class_exists($controllerName)) {
        // Khởi tạo Controller
        $controller = new $controllerName;

        // Kiểm tra method có tồn tại trong Controller không?
        if (method_exists($controller, $methodName)) {
            // Gọi method và truyền tham số (nếu có)
            // call_user_func_array dùng để gọi hàm với tham số là mảng
            call_user_func_array([$controller, $methodName], $params);
        } else {
            // Xử lý lỗi: Method không tồn tại
            die("Method '{$methodName}' không tồn tại trong Controller '{$controllerName}'");
        }
    } else {
        // Xử lý lỗi: Class Controller không tồn tại
        die("Controller class '{$controllerName}' không tồn tại");
    }
} else {
    // Xử lý lỗi: File Controller không tồn tại
    die("Controller file '{$controllerFile}' không tồn tại");
}
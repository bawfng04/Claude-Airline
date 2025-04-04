<?php
// public/index.php

// Load Config
require_once '../app/config/config.php';
require_once '../app/helpers/url_helper.php';
// Autoload Core Classes
spl_autoload_register(function ($className) {
    $corePath = '../app/core/' . $className . '.php';
    if (file_exists($corePath)) {
        require_once $corePath;
    }
});

// --- Routing ---
define('DEFAULT_CONTROLLER', 'home'); // Controller mặc định
define('DEFAULT_METHOD', 'index');   // Method mặc định

$controllerName = DEFAULT_CONTROLLER; // Controller mặc định
$methodName = DEFAULT_METHOD;         // Method mặc định
$params = [];                         // Tham số truyền vào method

// Parse URL từ biến 'url' mà .htaccess tạo ra
if (isset($_GET['url'])) {
    // Trim dấu / ở cuối, lọc ký tự không hợp lệ, tách thành mảng bằng dấu /
    $url = rtrim($_GET['url'], '/');
    $url = filter_var($url, FILTER_SANITIZE_URL);
    $url = explode('/', $url);

    // Phần tử 0: Tên Controller
    if (!empty($url[0])) {
        $controllerName = ucwords($url[0]); // Viết hoa chữ cái đầu: home -> Home
        unset($url[0]);
    }

    // Phần tử 1: Tên Method (Action)
    if (isset($url[1]) && !empty($url[1])) {
        $methodName = $url[1];
        unset($url[1]);
    }

    // Phần còn lại: Tham số
    $params = $url ? array_values($url) : [];
}

// --- Điều phối (Dispatch) ---
try {
    $controllerFile = '../app/controllers/' . $controllerName . '.php';

    // Kiểm tra file Controller có tồn tại không
    if (!file_exists($controllerFile)) {
        throw new Exception("Controller file '{$controllerFile}' không tồn tại");
    }

    require_once $controllerFile;

    // Kiểm tra class Controller có tồn tại không
    if (!class_exists($controllerName)) {
        throw new Exception("Controller class '{$controllerName}' không tồn tại");
    }

    $controller = new $controllerName;

    // Kiểm tra method có tồn tại trong Controller không
    if (!method_exists($controller, $methodName)) {
        throw new Exception("Method '{$methodName}' không tồn tại trong Controller '{$controllerName}'");
    }

    // Gọi method và truyền tham số (nếu có)
    call_user_func_array([$controller, $methodName], $params);

} catch (Exception $e) {
    // Hiển thị lỗi nếu có
    die($e->getMessage());
}
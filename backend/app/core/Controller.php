<?php
// app/core/Controller.php

class Controller {
    // Load Model
    public function model($model) {
        // Require model file
        $modelPath = '../app/models/' . $model . '.php';
        if (file_exists($modelPath)) {
            require_once $modelPath;
            // Instantiate model
            return new $model();
        } else {
            // Hoặc ném exception, hoặc log lỗi
            die('Model không tồn tại: ' . $modelPath);
        }
    }

    // Load View
    // $data là mảng chứa dữ liệu cần truyền sang View
    public function view($view, $data = []) {
        // Check for view file
        $viewPath = '../app/views/' . $view . '.php';
        if (file_exists($viewPath)) {
            // Extract data array thành các biến riêng lẻ
            // Ví dụ: $data = ['title' => 'Homepage'] -> thành biến $title = 'Homepage' trong view
            extract($data);

            require_once $viewPath;
        } else {
            die('View không tồn tại: ' . $viewPath);
        }
    }
}
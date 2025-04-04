<?php

class Home extends Controller {
    public function index() {
        // Gọi view index.php trong thư mục views
        $this->view('index');
    }
}
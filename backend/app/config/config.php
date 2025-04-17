<?php
require_once __DIR__ . '/env.php';
loadEnv();
// config/config.php

// Thông tin kết nối Database (Dùng cho XAMPP với MySQL/phpMyAdmin)
define('DB_HOST', getenv('DB_HOST'));
define('DB_PORT', getenv('DB_PORT'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASS', getenv('DB_PASS'));
define('DB_NAME', getenv('DB_NAME'));

// connect db: http://localhost/phpmyadmin
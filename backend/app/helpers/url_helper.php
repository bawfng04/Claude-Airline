<?php
require_once __DIR__ . '/../config/env.php';
loadEnv();

function base_url($path = '') {
    $base_url = rtrim(getenv('BASE_URL'), '/');
    if (!empty($path)) {
        return $base_url . '/' . ltrim($path, '/');
    }
    return $base_url . '/';
}
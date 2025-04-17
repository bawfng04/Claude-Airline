<?php
require_once __DIR__ . '/../config/env.php';
loadEnv();

function base_url($path = '') {
    return getenv('BASE_URL') . ltrim($path, '/');
}
<?php
// app/core/Database.php

class Database {
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;

    private $dbh; // Database Handler
    private $stmt; // Statement
    private $error;

    public function __construct() {
        // Set DSN (Data Source Name)
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname;
        $options = [
            PDO::ATTR_PERSISTENT => true, // Kết nối bền vững (tùy chọn)
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Ném Exception khi có lỗi SQL
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Trả về dạng mảng associative
            PDO::ATTR_EMULATE_PREPARES => false, // Dùng prepared statements thật của DB
        ];

        // Tạo PDO instance
        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();

            die("Không thể kết nối CSDL: " . $this->error);
        }
    }

    // Chuẩn bị câu lệnh SQL (Prepared Statement)
    public function query($sql) {
        $this->stmt = $this->dbh->prepare($sql);
    }

    // Gán giá trị vào placeholder trong prepared statement
    // $param: Tên placeholder (vd: :id)
    // $value: Giá trị gán vào
    // $type: Kiểu dữ liệu (PDO::PARAM_INT, PDO::PARAM_STR, ...) - Tự động nếu null
    public function bind($param, $value, $type = null) {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    // Thực thi prepared statement
    public function execute() {
        try {
            return $this->stmt->execute();
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            // Log lỗi ở đây
            echo "Lỗi thực thi SQL: " . $this->error; // Chỉ để debug, không nên echo lỗi ra production
            return false;
        }
    }

    // Lấy tất cả kết quả (mảng các mảng associative)
    public function resultSet() {
        $this->execute();
        return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy một dòng kết quả (mảng associative)
    public function single() {
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Lấy số dòng bị ảnh hưởng bởi câu lệnh INSERT, UPDATE, DELETE
    public function rowCount() {
        return $this->stmt->rowCount();
    }

     // Lấy ID của dòng vừa insert
    public function lastInsertId() {
        return $this->dbh->lastInsertId();
    }
}
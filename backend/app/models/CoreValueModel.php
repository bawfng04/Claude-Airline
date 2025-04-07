<?php
class CoreValueModel extends Database {
    // Lấy tất cả các giá trị cốt lõi
    public function getAllCoreValues() {
        $this->query("SELECT * FROM core_value ORDER BY created_at DESC");
        return $this->resultSet();
    }

    // Lấy một giá trị cốt lõi theo ID
    public function getCoreValueById($id) {
        $this->query("SELECT * FROM core_value WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Kiểm tra xem giá trị cốt lõi có tồn tại không
    public function coreValueExists($id) {
        $this->query("SELECT COUNT(*) as count FROM core_value WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single()['count'] > 0;
    }

    // Thêm mới giá trị cốt lõi
    public function addCoreValue($title, $description, $icon) {
        $this->query("INSERT INTO core_value (title, description, icon) VALUES (:title, :description, :icon)");
        $this->bind(':title', $title);
        $this->bind(':description', $description);
        $this->bind(':icon', $icon); // Lưu text của icon
        return $this->execute();
    }

    // Cập nhật giá trị cốt lõi
    public function updateCoreValue($id, $title, $description, $icon = null) {
        if ($icon) {
            $this->query("UPDATE core_value SET title = :title, description = :description, icon = :icon WHERE id = :id");
            $this->bind(':icon', $icon); // Lưu text của icon
        } else {
            $this->query("UPDATE core_value SET title = :title, description = :description WHERE id = :id");
        }
        $this->bind(':id', $id);
        $this->bind(':title', $title);
        $this->bind(':description', $description);
        return $this->execute();
    }

    // Xóa giá trị cốt lõi
    public function deleteCoreValue($id) {
        $this->query("DELETE FROM core_value WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
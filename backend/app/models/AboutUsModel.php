<?php
class AboutUsModel extends Database {
    // Lấy tất cả các bản ghi
    public function getAllAboutUs() {
        $this->query("SELECT * FROM about_us ORDER BY created_at DESC");
        return $this->resultSet();
    }

    // Lấy một bản ghi theo ID
    public function getAboutUsById($id) {
        $this->query("SELECT * FROM about_us WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm mới bản ghi
    public function addAboutUs($title, $content) {
        $this->query("INSERT INTO about_us (title, content) VALUES (:title, :content)");
        $this->bind(':title', $title);
        $this->bind(':content', $content);
        return $this->execute();
    }

    // Cập nhật bản ghi
    public function updateAboutUs($id, $title, $content) {
        $this->query("UPDATE about_us SET title = :title, content = :content WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':title', $title);
        $this->bind(':content', $content);
        return $this->execute();
    }

    // Xóa bản ghi
    public function deleteAboutUs($id) {
        $this->query("DELETE FROM about_us WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
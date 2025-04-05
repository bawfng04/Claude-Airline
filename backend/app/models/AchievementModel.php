<?php
class AchievementModel extends Database {
    // Lấy tất cả thành tựu
    public function getAllAchievements() {
        $this->query("SELECT * FROM achievements ORDER BY year DESC");
        return $this->resultSet();
    }

    // Lấy một thành tựu theo ID
    public function getAchievementById($id) {
        $this->query("SELECT * FROM achievements WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm mới thành tựu
    public function addAchievement($year, $title, $description) {
        $this->query("INSERT INTO achievements (year, title, description) VALUES (:year, :title, :description)");
        $this->bind(':year', $year);
        $this->bind(':title', $title);
        $this->bind(':description', $description);
        return $this->execute();
    }

    // Cập nhật thành tựu
    public function updateAchievement($id, $year, $title, $description) {
        $this->query("UPDATE achievements SET year = :year, title = :title, description = :description WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':year', $year);
        $this->bind(':title', $title);
        $this->bind(':description', $description);
        return $this->execute();
    }

    // Xóa thành tựu
    public function deleteAchievement($id) {
        $this->query("DELETE FROM achievements WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
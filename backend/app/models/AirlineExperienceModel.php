<?php
class AirlineExperienceModel extends Database {
    // Lấy tất cả các bản ghi
    public function getAllExperiences() {
        $this->query("SELECT * FROM airline_experience ORDER BY created_at DESC");
        return $this->resultSet();
    }

    // Lấy một bản ghi theo ID
    public function getExperienceById($id) {
        $this->query("SELECT * FROM airline_experience WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm mới bản ghi
    public function addExperience($title, $description, $image) {
        $this->query("INSERT INTO airline_experience (title, description, image) VALUES (:title, :description, :image)");
        $this->bind(':title', $title);
        $this->bind(':description', $description);
        $this->bind(':image', $image);
        return $this->execute();
    }

    // Cập nhật bản ghi
    public function updateExperience($id, $title, $description, $image = null) {
        if ($image) {
            $this->query("UPDATE airline_experience SET title = :title, description = :description, image = :image WHERE id = :id");
            $this->bind(':image', $image);
        } else {
            $this->query("UPDATE airline_experience SET title = :title, description = :description WHERE id = :id");
        }
        $this->bind(':id', $id);
        $this->bind(':title', $title);
        $this->bind(':description', $description);
        return $this->execute();
    }

    // Xóa bản ghi
    public function deleteExperience($id) {
        $this->query("DELETE FROM airline_experience WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
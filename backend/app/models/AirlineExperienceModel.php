<?php
class AirlineExperienceModel extends Database {
    // Lấy tất cả các trải nghiệm cùng mô tả
    public function getAllExperiences() {
        $this->query("
            SELECT ae.*, ed.description 
            FROM airline_experience ae
            LEFT JOIN experience_description ed ON ae.id = ed.airline_experience_id
            ORDER BY ae.created_at DESC
        ");
        return $this->resultSet();
    }

    // Lấy một trải nghiệm theo ID
    public function getExperienceById($id) {
        $this->query("
            SELECT ae.*, GROUP_CONCAT(ed.description SEPARATOR '||') AS descriptions
            FROM airline_experience ae
            LEFT JOIN experience_description ed ON ae.id = ed.airline_experience_id
            WHERE ae.id = :id
            GROUP BY ae.id
        ");
        $this->bind(':id', $id);
        $result = $this->single();

        // Tách danh sách mô tả thành mảng
        if ($result && !empty($result['descriptions'])) {
            $result['descriptions'] = explode('||', $result['descriptions']);
        } else {
            $result['descriptions'] = [];
        }

        return $result;
    }

    // Thêm mới trải nghiệm và mô tả
    public function addExperience($title, $image, $descriptions) {
        $this->query("INSERT INTO airline_experience (title, image) VALUES (:title, :image)");
        $this->bind(':title', $title);
        $this->bind(':image', $image);
        $this->execute();
        $experienceId = $this->lastInsertId();

        foreach ($descriptions as $description) {
            $this->query("INSERT INTO experience_description (airline_experience_id, description) VALUES (:experience_id, :description)");
            $this->bind(':experience_id', $experienceId);
            $this->bind(':description', $description);
            $this->execute();
        }

        return true;
    }

    // Cập nhật trải nghiệm và mô tả
    public function updateExperience($id, $title, $image = null, $descriptions = []) {
        if ($image) {
            $this->query("UPDATE airline_experience SET title = :title, image = :image WHERE id = :id");
            $this->bind(':image', $image);
        } else {
            $this->query("UPDATE airline_experience SET title = :title WHERE id = :id");
        }
        $this->bind(':id', $id);
        $this->bind(':title', $title);
        $this->execute();

        // Xóa mô tả cũ
        $this->query("DELETE FROM experience_description WHERE airline_experience_id = :id");
        $this->bind(':id', $id);
        $this->execute();

        // Thêm mô tả mới
        foreach ($descriptions as $description) {
            $this->query("INSERT INTO experience_description (airline_experience_id, description) VALUES (:experience_id, :description)");
            $this->bind(':experience_id', $id);
            $this->bind(':description', $description);
            $this->execute();
        }

        return true;
    }

    // Xóa trải nghiệm và mô tả
    public function deleteExperience($id) {
        $this->query("DELETE FROM airline_experience WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }

    public function getAllExperiencesJSON() {
        $this->query("
            SELECT ae.id, ae.title, ae.image, ed.description
            FROM airline_experience ae
            LEFT JOIN experience_description ed ON ae.id = ed.airline_experience_id
            ORDER BY ae.created_at DESC
        ");
        $results = $this->resultSet();

        // Nhóm các mô tả theo từng trải nghiệm
        $experiences = [];
        foreach ($results as $row) {
            $id = $row['id'];
            if (!isset($experiences[$id])) {
                $experiences[$id] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'image' => $row['image'],
                    'descriptions' => []
                ];
            }
            if (!empty($row['description'])) {
                $experiences[$id]['descriptions'][] = $row['description'];
            }
        }

        return array_values($experiences); // Trả về danh sách trải nghiệm
    }
}
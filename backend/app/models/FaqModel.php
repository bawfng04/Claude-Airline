<?php
// app/models/FaqModel.php

class FaqModel extends Database {
    // Lấy tất cả câu hỏi
    public function getAllFaqs() {
        $this->query("SELECT * FROM faq ORDER BY id");
        return $this->resultSet();
    }

    public function getAllCategories() {
        $this->query("SELECT category FROM faq GROUP BY category ORDER BY category");
        return $this->resultSet();
    }

    // Lấy câu hỏi theo ID
    public function getFaqById($id) {
        if (!is_numeric($id)) {
            return false; // ID không hợp lệ
        }

        $this->query("SELECT * FROM faq WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm câu hỏi mới
    public function addFaq($question, $answer, $category) {
        $this->query("INSERT INTO faq (question, answer, category) VALUES (:question, :answer, :category)");
        $this->bind(':question', trim($question));
        $this->bind(':answer', trim($answer));
        $this->bind(':category', trim($category));

        try {
            return $this->execute();
        } catch (PDOException $e) {
            error_log("Lỗi thêm câu hỏi: " . $e->getMessage());
            return false;
        }
    }

    // Cập nhật câu hỏi
    public function updateFaq($id, $question, $answer, $category) {
        if (!is_numeric($id)) {
            return false;
        }

        $this->query("UPDATE faq SET question = :question, answer = :answer, category = :category WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':question', trim($question));
        $this->bind(':answer', trim($answer));
        $this->bind(':category', trim($category));

        try {
            $this->execute();
            return $this->rowCount(); // Trả về số dòng bị ảnh hưởng
        } catch (PDOException $e) {
            error_log("Lỗi cập nhật câu hỏi ID $id: " . $e->getMessage());
            return false;
        }
    }

    // Xóa câu hỏi
    public function deleteFaq($id) {
        if (!is_numeric($id)) {
            return false;
        }

        $this->query("DELETE FROM faq WHERE id = :id");
        $this->bind(':id', $id);

        try {
            $this->execute();
            return $this->rowCount() > 0; // Trả về true nếu có dòng bị xóa
        } catch (PDOException $e) {
            error_log("Lỗi xóa câu hỏi ID $id: " . $e->getMessage());
            return false;
        }
    }
}

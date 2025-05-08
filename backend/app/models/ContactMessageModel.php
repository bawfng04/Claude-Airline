<?php

class ContactMessageModel extends Database {

    public function addMessage($name, $email, $phone, $subject, $message) {
        $this->query("INSERT INTO CONTACT_MESSAGES (name, email, phone, subject, message) VALUES (:name, :email, :phone, :subject, :message)");
        $this->bind(':name', $name);
        $this->bind(':email', $email);
        $this->bind(':phone', $phone);
        $this->bind(':subject', $subject);
        $this->bind(':message', $message);
        return $this->execute();
    }

    public function getAllMessages() {
        $this->query("SELECT * FROM CONTACT_MESSAGES ORDER BY created_at DESC");
        return $this->resultSet();
    }

    public function getMessageById($id) {
        $this->query("SELECT * FROM CONTACT_MESSAGES WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    public function updateMessageStatus($id, $status) {
        $this->query("UPDATE CONTACT_MESSAGES SET status = :status WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':status', $status);
        return $this->execute();
    }

    public function deleteMessage($id) {
        $this->query("DELETE FROM CONTACT_MESSAGES WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
<?php
class UserModel extends Database {
    // Lấy tất cả người dùng
    public function getAllUsers() {
        $this->query("SELECT * FROM USERS ORDER BY CREATED_AT DESC");
        return $this->resultSet();
    }

    // Lấy thông tin người dùng theo ID
    public function getUserById($id) {
        $this->query("SELECT * FROM USERS WHERE ID = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm người dùng mới
    public function addUser($data) {
        $this->query("INSERT INTO USERS (FAMILY_NAME, GIVEN_NAME, EMAIL, PASSWORD, PHONE_NUMBER, BIRTHDAY, NATIONALITY, MEMBERSHIP, image, ROLE, ACTIVE) 
                      VALUES (:family_name, :given_name, :email, :password, :phone_number, :birthday, :nationality, :membership, :image, :role, :active)");
        $this->bind(':family_name', $data['family_name']);
        $this->bind(':given_name', $data['given_name']);
        $this->bind(':email', $data['email']);
        $this->bind(':password', $data['password']);
        $this->bind(':phone_number', $data['phone_number']);
        $this->bind(':birthday', $data['birthday']);
        $this->bind(':nationality', $data['nationality']);
        $this->bind(':membership', $data['membership']);
        $this->bind(':image', $data['image']);
        $this->bind(':role', $data['role']);
        $this->bind(':active', $data['active']);
        return $this->execute();
    }

    // Cập nhật thông tin người dùng
    public function updateUser($id, $data) {
        $this->query("UPDATE USERS SET FAMILY_NAME = :family_name, GIVEN_NAME = :given_name, EMAIL = :email, PHONE_NUMBER = :phone_number, 
                      BIRTHDAY = :birthday, NATIONALITY = :nationality, MEMBERSHIP = :membership, image = :image, ROLE = :role, ACTIVE = :active 
                      WHERE ID = :id");
        $this->bind(':id', $id);
        $this->bind(':family_name', $data['family_name']);
        $this->bind(':given_name', $data['given_name']);
        $this->bind(':email', $data['email']);
        $this->bind(':phone_number', $data['phone_number']);
        $this->bind(':birthday', $data['birthday']);
        $this->bind(':nationality', $data['nationality']);
        $this->bind(':membership', $data['membership']);
        $this->bind(':image', $data['image']);
        $this->bind(':role', $data['role']);
        $this->bind(':active', $data['active']);
        return $this->execute();
    }

    public function updateUserStatus($id, $isActive) {
        $this->query("UPDATE USERS SET ACTIVE = :active WHERE ID = :id");
        $this->bind(':active', $isActive);
        $this->bind(':id', $id);
        return $this->execute();
    }

    public function getUserByEmail($email) {
        $this->query("SELECT * FROM USERS WHERE EMAIL = :email");
        $this->bind(':email', $email);
        return $this->single();
    }
}
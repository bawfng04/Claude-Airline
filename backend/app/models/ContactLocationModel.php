<?php


// CREATE TABLE CONTACT_LOCATIONS (
//     id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
//     location_name VARCHAR(255) NOT NULL, -- Tên địa điểm
//     des_type VARCHAR(50) NOT NULL, -- Loại địa chỉ (ví dụ: văn phòng, chi nhánh)
//     address_string VARCHAR(255) NOT NULL, -- Địa chỉ
//     phone_number VARCHAR(20) NOT NULL, -- Số điện thoại
//     working_hours VARCHAR(50) NOT NULL, -- Giờ làm việc
//     email VARCHAR(255) NOT NULL, -- Địa chỉ email
//     location_embed_code TEXT NOT NULL, -- Sđịa điểm (Google Maps)
// );



class ContactLocationModel extends Database {
    // Lấy tất cả các bản ghi
    public function getAllContactLocations(){
        $this->query("SELECT * FROM CONTACT_LOCATIONS");
        return $this->resultSet();
    }

    // lấy theo id
    public function getAllContactLocationsById($id){
        $this->query("SELECT * FROM CONTACT_LOCATIONS WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    public function addContactLocation($location_name, $des_type, $address_string, $phone_number, $working_hours, $email, $location_embed_code){
        $this->query("INSERT INTO CONTACT_LOCATIONS (location_name, des_type, address_string, phone_number, working_hours, email, location_embed_code) VALUES (:location_name, :des_type, :address_string, :phone_number, :working_hours, :email, :location_embed_code)");
        $this->bind(':location_name', $location_name);
        $this->bind(':des_type', $des_type);
        $this->bind(':address_string', $address_string);
        $this->bind(':phone_number', $phone_number);
        $this->bind(':working_hours', $working_hours);
        $this->bind(':email', $email);
        $this->bind(':location_embed_code', $location_embed_code);
        return $this->execute();
    }

    public function modifyContactLocation($id, $location_name, $des_type, $address_string, $phone_number, $working_hours, $email, $location_embed_code){
        $this->query("UPDATE CONTACT_LOCATIONS SET location_name = :location_name, des_type = :des_type, address_string = :address_string, phone_number = :phone_number, working_hours = :working_hours, email = :email, location_embed_code = :location_embed_code WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':location_name', $location_name);
        $this->bind(':des_type', $des_type);
        $this->bind(':address_string', $address_string);
        $this->bind(':phone_number', $phone_number);
        $this->bind(':working_hours', $working_hours);
        $this->bind(':email', $email);
        $this->bind(':location_embed_code', $location_embed_code);
        return $this->execute();
    }

    public function deleteContactLocation($id){
        $this->query("DELETE FROM CONTACT_LOCATIONS WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}


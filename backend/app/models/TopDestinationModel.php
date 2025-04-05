<?php


// CREATE TABLE HOMEPAGE_TOP_DESTINATIONS (
//     id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
//     destination_image VARCHAR(255) NOT NULL, -- Hình ảnh địa điểm
//     destination_name VARCHAR(255) NOT NULL, -- Tên địa điểm
//     destination_country VARCHAR(255) NOT NULL, -- Tên quốc gia
//     destination_price: DECIMAL(10, 2) NOT NULL, -- Giá vé
//     destination_description TEXT NOT NULL, -- Mô tả địa điểm
//     destination_begin: DATE NOT NULL, -- Ngày bắt đầu
//     destination_end: DATE NOT NULL, -- Ngày kết thúc
//     destination_offer: VARCHAR(255) NOT NULL, -- Ưu đãi địa điểm
//     destination_category: VARCHAR(255) NOT NULL, -- Danh mục địa điểm
// );

class TopDestinationModel extends Database {
    // Lấy tất cả các bản ghi
    public function getAllTopDestination(){
        $this->query("SELECT * FROM HOMEPAGE_TOP_DESTINATIONS");
        return $this->resultSet();
    }

    // lấy theo id
    public function getAllTopDestinationById($id){
        $this->query("SELECT * FROM HOMEPAGE_TOP_DESTINATIONS WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    public function addTopDestination($image, $name, $country, $price, $description, $begin, $end, $offer, $category){
        $this->query("INSERT INTO HOMEPAGE_TOP_DESTINATIONS (destination_image, destination_name, destination_country, destination_price, destination_description, destination_begin, destination_end, destination_offer, destination_category) VALUES (:image, :name, :country, :price, :description, :begin, :end, :offer, :category)");
        $this->bind(':image', $image);
        $this->bind(':name', $name);
        $this->bind(':country', $country);
        $this->bind(':price', $price);
        $this->bind(':description', $description);
        $this->bind(':begin', $begin);
        $this->bind(':end', $end);
        $this->bind(':offer', $offer);
        $this->bind(':category', $category);
        return $this->execute();
    }

    public function modifyTopDestination($id, $image, $name, $country, $price, $description, $begin, $end, $offer, $category){
        $this->query("UPDATE HOMEPAGE_TOP_DESTINATIONS SET destination_image = :image, destination_name = :name, destination_country = :country, destination_price = :price, destination_description = :description, destination_begin = :begin, destination_end = :end, destination_offer = :offer, destination_category = :category WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':image', $image);
        $this->bind(':name', $name);
        $this->bind(':country', $country);
        $this->bind(':price', $price);
        $this->bind(':description', $description);
        $this->bind(':begin', $begin);
        $this->bind(':end', $end);
        $this->bind(':offer', $offer);
        $this->bind(':category', $category);
        return $this->execute();
    }

    public function deleteTopDestination($id){
        $this->query("DELETE FROM HOMEPAGE_TOP_DESTINATIONS WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}


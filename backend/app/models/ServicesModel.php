<?php

// homepage_services: id, service_title, service_description, service_image

class ServicesModel extends Database {
    // Lấy hết services
    public function getAllServices() {
        $this->query("SELECT * FROM HOMEPAGE_SERVICES ORDER BY id DESC"); // Sắp xếp theo ID mới nhất
        return $this->resultSet();
    }

    public function getServiceById($id) {
        $this->query("SELECT * FROM HOMEPAGE_SERVICES WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    public function addService($image, $title, $description) {
        $this->query("INSERT INTO HOMEPAGE_SERVICES (service_image, service_title, service_description) VALUES (:image, :title, :description)");
        $this->bind(':image', $image);
        $this->bind(':title', $title);
        $this->bind(':description', $description);

        return $this->execute();
    }

    public function modifyService($id, $image, $title, $description) {
        $this->query("UPDATE HOMEPAGE_SERVICES SET service_image = :image, service_title = :title, service_description = :description WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':image', $image);
        $this->bind(':title', $title);
        $this->bind(':description', $description);

        // Execute
        return $this->execute();
    }

    // xoá
    public function deleteService($id) {
        $this->query("DELETE FROM HOMEPAGE_SERVICES WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
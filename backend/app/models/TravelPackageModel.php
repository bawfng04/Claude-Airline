<?php
class TravelPackageModel extends Database {
    // Lấy hết travel packages
    public function getAllTravelPackages() {
        $this->query("SELECT * FROM HOMEPAGE_TRAVEL_PACKAGES ORDER BY id DESC"); // Sắp xếp theo ID mới nhất
        return $this->resultSet();
    }

    public function getTravelPackageById($id) {
        $this->query("SELECT * FROM HOMEPAGE_TRAVEL_PACKAGES WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    public function addTravelPackage($image, $name, $description) {
        $this->query("INSERT INTO HOMEPAGE_TRAVEL_PACKAGES (package_image, package_name, package_description) VALUES (:image, :name, :description)");
        $this->bind(':image', $image);
        $this->bind(':name', $name);
        $this->bind(':description', $description);

        return $this->execute();
    }

    public function modifyTravelPackage($id, $image, $name, $description) {
        $this->query("UPDATE HOMEPAGE_TRAVEL_PACKAGES SET package_image = :image, package_name = :name, package_description = :description WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':image', $image);
        $this->bind(':name', $name);
        $this->bind(':description', $description);

        // Execute
        return $this->execute();
    }

    // xoá
    public function deleteTravelPackage($id) {
        $this->query("DELETE FROM HOMEPAGE_TRAVEL_PACKAGES WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
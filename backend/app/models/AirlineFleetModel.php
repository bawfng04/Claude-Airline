<?php
class AirlineFleetModel extends Database {
    // Lấy tất cả các máy bay
    public function getAllAircrafts() {
        $this->query("SELECT * FROM airline_fleet ORDER BY created_at DESC");
        return $this->resultSet();
    }

    // Lấy thông tin máy bay theo ID
    public function getAircraftById($id) {
        $this->query("SELECT * FROM airline_fleet WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm mới máy bay
    public function addAircraft($aircraft_model, $description, $image) {
        $this->query("INSERT INTO airline_fleet (aircraft_model, description, image) VALUES (:aircraft_model, :description, :image)");
        $this->bind(':aircraft_model', $aircraft_model);
        $this->bind(':description', $description);
        $this->bind(':image', $image);
        return $this->execute();
    }

    // Cập nhật thông tin máy bay
    public function updateAircraft($id, $aircraft_model, $description, $image = null) {
        if ($image) {
            $this->query("UPDATE airline_fleet SET aircraft_model = :aircraft_model, description = :description, image = :image WHERE id = :id");
            $this->bind(':image', $image);
        } else {
            $this->query("UPDATE airline_fleet SET aircraft_model = :aircraft_model, description = :description WHERE id = :id");
        }
        $this->bind(':id', $id);
        $this->bind(':aircraft_model', $aircraft_model);
        $this->bind(':description', $description);
        return $this->execute();
    }

    // Xóa máy bay
    public function deleteAircraft($id) {
        $this->query("DELETE FROM airline_fleet WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
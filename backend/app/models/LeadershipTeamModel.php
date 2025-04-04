<?php
class LeadershipTeamModel extends Database {
    public function getAllMembers() {
        $this->query("SELECT * FROM leadership_team ORDER BY id");
        return $this->resultSet();
    }

    public function getMemberById($id) {
        $this->query("SELECT * FROM leadership_team WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    public function addMember($name, $position, $bio, $image) {
        $this->query("INSERT INTO leadership_team (name, position, bio, image) VALUES (:name, :position, :bio, :image)");
        $this->bind(':name', $name);
        $this->bind(':position', $position);
        $this->bind(':bio', $bio);
        $this->bind(':image', $image);
        return $this->execute();
    }

    public function updateMember($id, $name, $position, $bio, $image = null) {
        if ($image) {
            $this->query("UPDATE leadership_team SET name = :name, position = :position, bio = :bio, image = :image WHERE id = :id");
            $this->bind(':image', $image);
        } else {
            $this->query("UPDATE leadership_team SET name = :name, position = :position, bio = :bio WHERE id = :id");
        }
        $this->bind(':id', $id);
        $this->bind(':name', $name);
        $this->bind(':position', $position);
        $this->bind(':bio', $bio);
        return $this->execute();
    }

    public function deleteMember($id) {
        $this->query("DELETE FROM leadership_team WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
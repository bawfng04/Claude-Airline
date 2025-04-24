<?php

// HOMEPAGE_IMAGE_CAROUSEL(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     carousel_image VARCHAR(255) NOT NULL,
//     carousel_alt TEXT NOT NULL,
//     carousel_caption TEXT NOT NULL,
// )

class ImageCarouselModel extends Database {
    // Lấy tất cả các bản ghi
    public function getAllImages() {
        $this->query("SELECT * FROM HOMEPAGE_IMAGE_CAROUSEL ORDER BY id DESC");
        return $this->resultSet();
    }

    // Lấy một bản ghi theo ID
    public function getImageById($id) {
        $this->query("SELECT * FROM HOMEPAGE_IMAGE_CAROUSEL WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm mới bản ghi
    public function addImage($image, $alt, $caption) {
        $this->query("INSERT INTO HOMEPAGE_IMAGE_CAROUSEL (carousel_image, carousel_alt, carousel_caption) VALUES (:image, :alt, :caption)");
        $this->bind(':image', $image);
        $this->bind(':alt', $alt);
        $this->bind(':caption', $caption);
        return $this->execute();
    }

    // Cập nhật bản ghi
    public function updateImage($id, $image, $alt, $caption) {
        $this->query("UPDATE HOMEPAGE_IMAGE_CAROUSEL SET carousel_image = :image, carousel_alt = :alt, carousel_caption = :caption WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':image', $image);
        $this->bind(':alt', $alt);
        $this->bind(':caption', $caption);
        return $this->execute();
    }


    // Xóa bản ghi
    public function deleteImage($id) {
        $this->query("DELETE FROM HOMEPAGE_IMAGE_CAROUSEL WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
<?php
class TestimonialModel extends Database {

    // Lấy tất cả testimonials
    public function getAllTestimonials() {
        $this->query("SELECT * FROM homepage_user_testimonials ORDER BY id DESC");
        return $this->resultSet();
    }

    // Lấy testimonial theo ID
    public function getTestimonialById($id) {
        $this->query("SELECT * FROM homepage_user_testimonials WHERE id = :id");
        $this->bind(':id', $id);
        return $this->single();
    }

    // Thêm testimonial mới
    public function addTestimonial($user_name, $user_testimonial, $user_image, $user_stars, $user_location) {
        $this->query("INSERT INTO homepage_user_testimonials (user_name, user_testimonial, user_image, user_stars, user_location) VALUES (:user_name, :user_testimonial, :user_image, :user_stars, :user_location)");
        $this->bind(':user_name', $user_name);
        $this->bind(':user_testimonial', $user_testimonial);
        $this->bind(':user_image', $user_image);
        $this->bind(':user_stars', $user_stars);
        $this->bind(':user_location', $user_location);
        return $this->execute();
    }

    // Sửa testimonial
    public function modifyTestimonial($id, $user_name, $user_testimonial, $user_image, $user_stars, $user_location) {
        $this->query("UPDATE homepage_user_testimonials SET user_name = :user_name, user_testimonial = :user_testimonial, user_image = :user_image, user_stars = :user_stars, user_location = :user_location WHERE id = :id");
        $this->bind(':id', $id);
        $this->bind(':user_name', $user_name);
        $this->bind(':user_testimonial', $user_testimonial);
        $this->bind(':user_image', $user_image);
        $this->bind(':user_stars', $user_stars);
        $this->bind(':user_location', $user_location);
        return $this->execute();
    }

    // Xóa testimonial
    public function deleteTestimonial($id) {
        $this->query("DELETE FROM homepage_user_testimonials WHERE id = :id");
        $this->bind(':id', $id);
        return $this->execute();
    }
}
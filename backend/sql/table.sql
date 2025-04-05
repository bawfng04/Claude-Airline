-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS claude_airlines;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE claude_airlines;

-- Tạo bảng faq
CREATE TABLE faq (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    question TEXT NOT NULL,            -- Câu hỏi
    answer TEXT NOT NULL,              -- Câu trả lời
    category VARCHAR(255) NOT NULL,    -- Danh mục
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);


CREATE TABLE CLAUDE_AIRLINES (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    phone_number VARCHAR(20) NOT NULL, -- Số điện thoại
    email VARCHAR(255) NOT NULL, -- Địa chỉ email
    destination VARCHAR(255) NOT NULL, -- Địa chỉ
    descr TEXT NOT NULL, -- Mô tả
    facebook VARCHAR(255) NOT NULL, -- Facebook
    twitter VARCHAR(255) NOT NULL, -- Twitter
    instagram VARCHAR(255) NOT NULL, -- Instagram
    linkedIn VARCHAR(255) NOT NULL -- LinkedIn
);

-- CONTACT_LOCATIONS
CREATE TABLE CONTACT_LOCATIONS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    des_type VARCHAR(50) NOT NULL, -- Loại địa chỉ (ví dụ: văn phòng, chi nhánh)
    address_string VARCHAR(255) NOT NULL, -- Địa chỉ
    phone_number VARCHAR(20) NOT NULL, -- Số điện thoại
    working_hours VARCHAR(50) NOT NULL, -- Giờ làm việc
);

-- HOMEPAGE_TOP_DESTINATIONS + HOMEPAGE_NEXT_TRIP
CREATE TABLE HOMEPAGE_TOP_DESTINATIONS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    destination_image VARCHAR(255) NOT NULL, -- Hình ảnh địa điểm
    destination_name VARCHAR(255) NOT NULL, -- Tên địa điểm
    destination_country VARCHAR(255) NOT NULL, -- Tên quốc gia
    destination_price: DECIMAL(10, 2) NOT NULL, -- Giá vé
    destination_description TEXT NOT NULL, -- Mô tả địa điểm
    destination_begin: DATE NOT NULL, -- Ngày bắt đầu
    destination_end: DATE NOT NULL, -- Ngày kết thúc
    destination_offer: VARCHAR(255) NOT NULL, -- Ưu đãi địa điểm
    destination_category: VARCHAR(255) NOT NULL, -- Danh mục địa điểm
);


-- HOMEPAGE_TRAVEL_PACKAGES
CREATE TABLE HOMEPAGE_TRAVEL_PACKAGES (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    package_image VARCHAR(255) NOT NULL, -- Hình ảnh gói du lịch
    package_name VARCHAR(255) NOT NULL, -- Tên gói du lịch
    package_description TEXT NOT NULL, -- Mô tả gói du lịch
);

-- HOMEPAGE_USER_TESTIMONIALS
CREATE TABLE HOMEPAGE_USER_TESTIMONIALS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    user_name VARCHAR(255) NOT NULL, -- Tên người dùng
    user_testimonial TEXT NOT NULL, -- Đánh giá của người dùng
    user_image VARCHAR(255) NOT NULL, -- Hình ảnh người dùng
    user_stars INT NOT NULL, -- Số sao đánh giá
    user_location VARCHAR(255) NOT NULL, -- Địa điểm của người dùng
);

-- HOMEPAGE_SERVICES
CREATE TABLE HOMEPAGE_SERVICES (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    service_title VARCHAR(255) NOT NULL, -- Tên dịch vụ
    service_description TEXT NOT NULL, -- Mô tả dịch vụ
    service_image VARCHAR(255) NOT NULL, -- Hình ảnh dịch vụ
);

-- Table: about_us
CREATE TABLE ABOUT_US (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: core_values
CREATE TABLE CORE_VALUE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: leadership_team
CREATE TABLE LEADERSHIP_TEAM (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: achievements
CREATE TABLE ACHIEVEMENTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year YEAR NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: airline_experience
CREATE TABLE AIRLINE_EXPERIENCE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: airline_fleet
CREATE TABLE AIRLINE_FLEET (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_model VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
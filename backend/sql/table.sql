-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS claude_airlines;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE claude_airlines;


-- HOMEPAGE_TOP_DESTINATIONS + HOMEPAGE_NEXT_TRIP
CREATE TABLE HOMEPAGE_TOP_DESTINATIONS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    destination_image VARCHAR(255) NOT NULL, -- Hình ảnh địa điểm
    destination_name VARCHAR(255) NOT NULL, -- Tên địa điểm
    destination_country VARCHAR(255) NOT NULL, -- Tên quốc gia
    destination_price DECIMAL(10, 2) NOT NULL, -- Giá vé
    destination_description TEXT NOT NULL, -- Mô tả địa điểm
    destination_begin DATE NOT NULL, -- Ngày bắt đầu
    destination_end DATE NOT NULL, -- Ngày kết thúc
    destination_offer VARCHAR(255) NOT NULL, -- Ưu đãi địa điểm
    destination_category VARCHAR(255) NOT NULL -- Danh mục địa điểm
);

-- HOMEPAGE_TRAVEL_PACKAGES
CREATE TABLE HOMEPAGE_TRAVEL_PACKAGES (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    package_image VARCHAR(255) NOT NULL, -- Hình ảnh gói du lịch
    package_name VARCHAR(255) NOT NULL, -- Tên gói du lịch
    package_description TEXT NOT NULL -- Mô tả gói du lịch
);

-- HOMEPAGE_USER_TESTIMONIALS
CREATE TABLE HOMEPAGE_USER_TESTIMONIALS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    user_name VARCHAR(255) NOT NULL, -- Tên người dùng
    user_testimonial TEXT NOT NULL, -- Đánh giá của người dùng
    user_image VARCHAR(255) NOT NULL, -- Hình ảnh người dùng
    user_stars INT NOT NULL, -- Số sao đánh giá
    user_location VARCHAR(255) NOT NULL -- Địa điểm của người dùng
);

-- HOMEPAGE_SERVICES
CREATE TABLE HOMEPAGE_SERVICES (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    service_title VARCHAR(255) NOT NULL, -- Tên dịch vụ
    service_description TEXT NOT NULL, -- Mô tả dịch vụ
    service_image VARCHAR(255) NOT NULL -- Hình ảnh dịch vụ
);

-- CONTACT_LOCATIONS
CREATE TABLE CONTACT_LOCATIONS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    location_name VARCHAR(255) NOT NULL, -- Tên địa điểm
    des_type VARCHAR(50) NOT NULL, -- Loại địa chỉ (ví dụ: văn phòng, chi nhánh)
    address_string VARCHAR(255) NOT NULL, -- Địa chỉ
    phone_number VARCHAR(20) NOT NULL, -- Số điện thoại
    working_hours VARCHAR(50) NOT NULL, -- Giờ làm việc
    email VARCHAR(255) NOT NULL, -- Địa chỉ email
    location_embed_code TEXT NOT NULL -- Sđịa điểm (Google Maps)
);

CREATE TABLE CONTACT_MESSAGES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Tạo bảng faq
CREATE TABLE faq (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    question TEXT NOT NULL,            -- Câu hỏi
    answer TEXT NOT NULL,              -- Câu trả lời
    category VARCHAR(255) NOT NULL,    -- Danh mục
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);

CREATE TABLE HOMEPAGE_IMAGE_CAROUSEL(
    id INT AUTO_INCREMENT PRIMARY KEY,
    carousel_image VARCHAR(255) NOT NULL,
    carousel_alt TEXT NOT NULL,
    carousel_caption TEXT NOT NULL
)



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
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng phụ: Mỗi mô tả riêng biệt liên kết với một trải nghiệm
CREATE TABLE EXPERIENCE_DESCRIPTION (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline_experience_id INT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (airline_experience_id) REFERENCES AIRLINE_EXPERIENCE(id) ON DELETE CASCADE
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

CREATE TABLE USERS (
    ID INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    FAMILY_NAME VARCHAR(50) NOT NULL, -- Họ
    GIVEN_NAME VARCHAR(50) NOT NULL, -- Tên
    EMAIL VARCHAR(100) NOT NULL UNIQUE, -- Địa chỉ email (duy nhất)
    PASSWORD VARCHAR(255) NOT NULL, -- Mật khẩu đã mã hóa
    PHONE_NUMBER VARCHAR(20), -- Số điện thoại (không bắt buộc unique)
    BIRTHDAY DATE NOT NULL, -- Ngày sinh
    NATIONALITY VARCHAR(50) NOT NULL, -- Quốc tịch
    MEMBERSHIP VARCHAR(50), -- Hạng thành viên (nếu có)
    image VARCHAR(255), -- Hình ảnh người dùng (nếu có)
    ROLE ENUM('USER', 'ADMIN') DEFAULT 'USER', -- Phân quyền
    ACTIVE BOOLEAN DEFAULT TRUE, -- Trạng thái tài khoản
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời gian cập nhật
);

CREATE TABLE HOMEPAGE_IMAGE_CAROUSEL(
    id INT AUTO_INCREMENT PRIMARY KEY,
    carousel_image VARCHAR(255) NOT NULL,
    carousel_alt TEXT NOT NULL,
    carousel_caption TEXT NOT NULL
);

-- `vlog_posts`
CREATE TABLE `vlog_posts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL COMMENT 'Author (FK to USERS.ID)',
    `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `introduction` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `main_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
    `featured_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gallery_images` json DEFAULT NULL,
    `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
    `no_of_ratings` int(11) UNSIGNED NOT NULL DEFAULT 0,
    `average_rating` decimal(3,1) DEFAULT NULL COMMENT,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `slug` (`slug`),
    KEY `vlog_post_author_fk` (`user_id`),
    CONSTRAINT `vlog_post_author_fk` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vlog_comments` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `post_id` int(11) NOT NULL,
    `user_id` int(11) DEFAULT NULL,
    `guest_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `rating` tinyint(3) unsigned DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
    `is_approved` tinyint(1) NOT NULL DEFAULT 0,
    `likes` int(11) UNSIGNED NOT NULL DEFAULT 0,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `post_id` (`post_id`),
    KEY `comment_user_fk` (`user_id`),
    CONSTRAINT `vlog_comments_post_fk` FOREIGN KEY (`post_id`) REFERENCES `vlog_posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `vlog_comments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



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

-- Chèn dữ liệu mẫu vào bảng faq
INSERT INTO faq (question, answer, category)
VALUES
('Làm thế nào để đặt vé máy bay?', 'Bạn có thể đặt vé máy bay qua website hoặc ứng dụng di động của chúng tôi.', 'General'),
('Tôi có thể hoàn vé không?', 'Có, bạn có thể hoàn vé theo chính sách hoàn vé của chúng tôi.', 'General'),
('Làm thế nào để thay đổi thông tin hành khách?', 'Bạn có thể thay đổi thông tin hành khách qua mục Quản lý đặt chỗ trên website.', 'Technical'),
('Phương thức thanh toán nào được hỗ trợ?', 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, thẻ ghi nợ và ví điện tử.', 'Billing'),
('Tôi có thể mang bao nhiêu hành lý xách tay?', 'Bạn được phép mang 7kg hành lý xách tay miễn phí.', 'General');


CREATE TABLE CLAUDE_AIRLINES (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    phone_number VARCHAR(20) NOT NULL, -- Số điện thoại
    email VARCHAR(255) NOT NULL, -- Địa chỉ email
    destination VARCHAR(255) NOT NULL, -- Địa chỉ
    descr TEXT NOT NULL, -- Mô tả
    facebook VARCHAR(255) NOT NULL, -- Facebook
    twitter VARCHAR(255) NOT NULL, -- Twitter
    instagram VARCHAR(255) NOT NULL, -- Instagram
    linkedIn VARCHAR(255) NOT NULL, -- LinkedIn
)

-- CONTACT_LOCATIONS
CREATE TABLE CONTACT_LOCATIONS (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID tự tăng, khóa chính
    des_type VARCHAR(50) NOT NULL, -- Loại địa chỉ (ví dụ: văn phòng, chi nhánh)
    address_string VARCHAR(255) NOT NULL, -- Địa chỉ
    phone_number VARCHAR(20) NOT NULL, -- Số điện thoại
    working_hours VARCHAR(50) NOT NULL, -- Giờ làm việc
)

INSERT INTO CONTACT_LOCATIONS (address_string, des_type, phone_number, working_hours)
VALUES
('123 Aviation Blvd, Los Angeles, CA 90045', 'Main Office', '+84 90 123 6608', 'Mon-Fri 9am-5pm'),
(' 456 Park Avenue, New York, NY 10022', 'Regional Office', '987-654-3210', 'Mon-Fri 10am-6pm'),
('789 Michigan Ave, Chicago, IL 60611', 'Regional Office', '555-555-5555', 'Mon-Fri 8am-4pm');


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
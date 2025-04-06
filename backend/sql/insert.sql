-- Chèn dữ liệu mẫu vào bảng faq
INSERT INTO faq (question, answer, category)
VALUES
('Làm thế nào để đặt vé máy bay?', 'Bạn có thể đặt vé máy bay qua website hoặc ứng dụng di động của chúng tôi.', 'General'),
('Tôi có thể hoàn vé không?', 'Có, bạn có thể hoàn vé theo chính sách hoàn vé của chúng tôi.', 'General'),
('Làm thế nào để thay đổi thông tin hành khách?', 'Bạn có thể thay đổi thông tin hành khách qua mục Quản lý đặt chỗ trên website.', 'Technical'),
('Phương thức thanh toán nào được hỗ trợ?', 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, thẻ ghi nợ và ví điện tử.', 'Billing'),
('Tôi có thể mang bao nhiêu hành lý xách tay?', 'Bạn được phép mang 7kg hành lý xách tay miễn phí.', 'General');

INSERT INTO CONTACT_LOCATIONS (address_string, des_type, phone_number, working_hours)
VALUES
('123 Aviation Blvd, Los Angeles, CA 90045', 'Main Office', '+84 90 123 6608', 'Mon-Fri 9am-5pm'),
(' 456 Park Avenue, New York, NY 10022', 'Regional Office', '987-654-3210', 'Mon-Fri 10am-6pm'),
('789 Michigan Ave, Chicago, IL 60611', 'Regional Office', '555-555-5555', 'Mon-Fri 8am-4pm');

INSERT INTO ABOUT_US (title, content)
VALUES
('Our Story', 'Founded in 1998, our airline began with a small fleet of just 3
              aircraft serving domestic routes. Today, we\'ve grown to become one
              of Southeast Asia\'s leading carriers, connecting passengers to
              over 100 destinations worldwide with a modern fleet of 78
              aircraft.'),
('Our Mission', 'To connect people and places with safe, reliable air travel
                  that is accessible to all, while delivering exceptional
                  service that exceeds expectations at every step of the
                  journey.'),
('Our Vision', 'To be recognized globally as the airline of choice, known for
                  innovation, sustainability, and a customer experience that
                  sets the industry standard.');


INSERT INTO HOMEPAGE_TOP_DESTINATIONS (destination_image, destination_name, destination_country, destination_price, destination_description, destination_begin, destination_end, destination_offer, destination_category)
VALUES
('image1.jpg', 'Paris', 'France', 499.99, 'Explore the city of lights with our exclusive package.', '2023-12-01', '2023-12-10', '20% off for early bookings!', 'Europe'),
('image2.jpg', 'Tokyo', 'Japan', 699.99, 'Experience the blend of tradition and modernity in Tokyo.', '2024-01-15', '2024-01-25', 'Free guided tours included!', 'Asia'),
('image3.jpg', 'New York', 'USA', 899.99, 'Discover the vibrant culture and iconic landmarks of New York City.', '2024-02-05', '2024-02-15', 'Book now and get a free city tour!', 'North America');

-- Claude Airlines
INSERT INTO CLAUDE_AIRLINES (phone_number, email, destination, descr, facebook, twitter, instagram, linkedIn)
VALUES
    ('+84 90 123 4567', 'claude-airline@gmail.com', '123 Aviation Blvd, Los Angeles, CA 90045', 'Claude Airlines is dedicated to providing world-class air travel experiences with modern aircraft, exceptional service, and a commitment to safety and sustainability.', "facebook.com",'x.com', 'instagram.com', 'linkedin.com');

--Contact Locations
INSERT INTO CONTACT_LOCATIONS (des_type, address_string, phone_number, working_hours)
VALUES
    ('Main Office', '123 Aviation Blvd, Los Angeles, CA 90045', '+84 90 123 4567', 'Mon-Fri 9am-5pm'),
    ('Regional Office', '456 Park Avenue, New York, NY 10022', '+84 90 987 6543', 'Mon-Fri 10am-6pm'),
    ('Branch Office', '789 Michigan Ave, Chicago, IL 60611', '+84 90 555 5555', 'Mon-Fri 8am-4pm');
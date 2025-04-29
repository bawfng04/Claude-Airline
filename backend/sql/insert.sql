-- Chèn dữ liệu mẫu vào bảng faq
INSERT INTO faq (question, answer, category)
VALUES
-- Booking
(
  'How do I book a flight?',
  'To book a flight, navigate to our homepage and use the booking form. Enter your departure and arrival destinations, select your travel dates, and click ''Search Flights''. You''ll then be presented with available options where you can select your preferred flight and complete the booking process by entering passenger details and payment information.',
  'Booking'
),
(
  'Can I book a flight for someone else?',
  'Yes, you can book a flight for someone else. Simply enter their details in the passenger information section during the booking process.',
  'Booking'
),
(
  'What payment methods do you accept?',
  'We accept major credit cards, debit cards, and online payment methods such as PayPal. Some routes may also allow payment via bank transfer.',
  'Booking'
),
-- Baggage
(
  'What is your baggage allowance policy?',
  'Our standard baggage allowance includes one carry-on bag (max. 7kg) and one checked bag (max. 23kg) per passenger. Premium and business class passengers are entitled to additional baggage allowance. Excess baggage can be purchased during booking or at check-in. Please note that specific routes may have different restrictions, so we recommend checking your flight details.',
  'Baggage'
),
(
  'Can I bring sports equipment as checked baggage?',
  'Yes, sports equipment such as golf clubs, skis, and bicycles can be checked in. Additional fees may apply depending on the size and weight of the equipment.',
  'Baggage'
),
(
  'What items are prohibited in carry-on baggage?',
  'Prohibited items include sharp objects, flammable liquids, and any items that pose a security risk. Please check our website for a full list of restricted items.',
  'Baggage'
),
-- Reservation
(
  'Can I change or cancel my reservation?',
  'Yes, changes and cancellations can be made through your account on our website or by contacting our customer service. Changes made at least 24 hours before departure typically incur a change fee plus any fare difference. Cancellation policies vary based on the fare type you purchased - flexible fares offer more generous cancellation terms compared to promotional fares.',
  'Reservation'
),
(
  'How do I check my booking status?',
  'You can check your booking status by logging into your account on our website or using the booking reference number provided in your confirmation email.',
  'Reservation'
),
(
  'What happens if I miss my flight?',
  'If you miss your flight, please contact our customer service team immediately. Depending on your fare type, you may be able to rebook for a later flight with an additional fee.',
  'Reservation'
),
-- Membership
(
  'How do I join your frequent flyer program?',
  'Joining our frequent flyer program is easy and free. Simply click on the ''Join Now'' button on our website and complete the registration form. Once registered, you''ll receive a membership number that you can use when booking flights to earn miles. These miles can be redeemed for free flights, upgrades, and various other rewards with our partner airlines and businesses.',
  'Membership'
),
(
  'How do I redeem my frequent flyer miles?',
  'You can redeem your miles for free flights, seat upgrades, and other rewards through your account on our website. Simply log in and navigate to the ''Redeem Miles'' section.',
  'Membership'
),
(
  'Do my frequent flyer miles expire?',
  'Yes, miles typically expire after 24 months of inactivity. To keep your account active, ensure you earn or redeem miles within this period.',
  'Membership'
),
-- Accessibility
(
  'Do you provide special assistance for passengers with disabilities?',
  'Yes, we offer special assistance services for passengers with disabilities or reduced mobility. These services include wheelchair assistance, priority boarding, and special seating arrangements. To ensure a smooth travel experience, please inform us of any requirements at least 48 hours before your flight by contacting our customer service team or including this information during the booking process.',
  'Accessibility'
),
(
  'Can I travel with a service animal?',
  'Yes, service animals are allowed on our flights. Please provide documentation and notify us at least 48 hours before your flight to ensure proper arrangements.',
  'Accessibility'
),
(
  'Are there special facilities for visually impaired passengers?',
  'Yes, we provide assistance for visually impaired passengers, including priority boarding and in-flight support. Please inform us of your needs during booking.',
  'Accessibility'
),
-- Health & Safety
(
  'What COVID-19 measures are currently in place?',
  'We continue to maintain enhanced hygiene protocols on all our flights. These include regular disinfection of high-touch surfaces, HEPA air filters on aircraft, and modified meal services where appropriate. Requirements for testing, vaccination, or mask-wearing vary by destination and are regularly updated in line with local regulations. Please check the latest requirements for your specific route before traveling.',
  'Health & Safety'
),
(
  'Do I need a COVID-19 test before flying?',
  'Testing requirements vary by destination. Please check the latest travel advisories for your departure and arrival locations.',
  'Health & Safety'
),
(
  'What should I do if I feel unwell before my flight?',
  'If you feel unwell, we recommend consulting a doctor and contacting our customer service team to discuss your options for rescheduling your flight.',
  'Health & Safety'
),
-- Travel Guidelines
(
  'How early should I arrive at the airport?',
  'We recommend arriving at the airport at least 2 hours before domestic flights and 3 hours before international flights. This allows adequate time for check-in, security screening, immigration procedures (for international flights), and boarding. During peak travel seasons or at busy airports, you may want to allow additional time to avoid any stress from unexpected delays.',
  'Travel Guidelines'
),
(
  'What documents do I need for international travel?',
  'For international travel, you will need a valid passport, visa (if required), and any additional documents specified by the destination country. Please check the entry requirements before your trip.',
  'Travel Guidelines'
),
(
  'Can I bring food and drinks on board?',
  'Yes, you can bring food and non-alcoholic beverages on board. However, liquids must comply with the 100ml limit for carry-on baggage.',
  'Travel Guidelines'
);

INSERT INTO CONTACT_LOCATIONS (address_string, des_type, phone_number, working_hours)
VALUES
('123 Aviation Blvd, Los Angeles, CA 90045', 'Main Office', '+84 90 123 6608', 'Mon-Fri 9am-5pm'),
(' 456 Park Avenue, New York, NY 10022', 'Regional Office', '987-654-3210', 'Mon-Fri 10am-6pm'),
('789 Michigan Ave, Chicago, IL 60611', 'Regional Office', '555-555-5555', 'Mon-Fri 8am-4pm');

INSERT INTO ABOUT_US (title, content)
VALUES
('Our Story', "Founded in 1998, our airline began with a small fleet of just 3 aircraft serving domestic routes. Today, we've grown to become one of Southeast Asia's leading carriers, connecting passengers to over 100 destinations worldwide with a modern fleet of 78 aircraft."),
('Our Mission', 'To connect people and places with safe, reliable air travel that is accessible to all, while delivering exceptional service that exceeds expectations at every step of the journey.'),
('Our Vision', 'To be recognized globally as the airline of choice, known for innovation, sustainability, and a customer experience that sets the industry standard.');


INSERT INTO CORE_VALUE (title, description, icon)
VALUES
('Customer Focus', 'We prioritize our customers in everything we do, ensuring their needs and preferences are at the forefront of our services.', 'FaUsers'),
('Safety First', 'Safety is non-negotiable, and we maintain the highest standards in all our operations.', 'FaCheckCircle'),
('Excellence', 'We strive for excellence in every aspect of our service, continuously improving to exceed expectations.', 'FaMedal'),
('Reliability', 'We keep our promises to passengers, with punctuality and dependability in all our operations.', 'FaHistory')

INSERT INTO ACHIEVEMENTS (title, description, year)
VALUES
('Best Airline in Asia', 'Awarded by Skytrax World Airline Awards for the second consecutive year', '2024'),
('Best Airline in Southeast Asia', 'Awarded by Skytrax World Airline Awards for the third consecutive year', '2023'),
('Top 10 Airlines Worldwide', 'Ranked by AirlineRatings.com for safety and service excellence', '2022'),
('Green Airline of the Year', 'Recognized for our commitment to sustainability and reducing carbon emissions', '2021'),
('Best Cabin Crew', 'Awarded by Skytrax World Airline Awards for outstanding service and hospitality', '2020'),
('Best Low-Cost Airline', 'Recognized for providing affordable travel options without compromising on quality', '2019'),
('Most Innovative Airline', 'Awarded for our use of technology to enhance the passenger experience', '2018')


INSERT INTO LEADERSHIP_TEAM (name, position, bio)
VALUES
('John Doe', 'CEO', "John has over 20 years of experience in the aviation industry and has been instrumental in the airline's growth and success. He is passionate about customer service and innovation."),
('Jane Smith', 'CFO', "Jane is a seasoned finance professional with a strong background in corporate finance and strategic planning. She ensures the airline's financial health and sustainability."),
('Michael Brown', 'COO', "Michael oversees the airline's operations, ensuring safety, efficiency, and reliability in all aspects of our service."),
('Emily Davis', 'CMO', 'Emily leads the marketing and customer experience teams, focusing on enhancing brand loyalty and customer satisfaction.');

INSERT INTO AIRLINE_FLEET (aircraft_model, description)
VALUES
('Boeing 737 MAX', "The Boeing 737 MAX is a narrow-body aircraft designed for short to medium-haul routes, featuring advanced aerodynamics and fuel efficiency."),
('Airbus A320', 'The Airbus A320 is a popular choice for airlines around the world, offering comfort and advanced technology for passengers and crew.'),
('Boeing 787 Dreamliner', 'The Boeing 787 Dreamliner is a long-haul aircraft that provides exceptional fuel efficiency and passenger comfort with its spacious cabin and modern amenities.'),
('Airbus A350', 'The Airbus A350 is a state-of-the-art long-haul aircraft designed for maximum comfort and fuel efficiency, featuring the latest in aviation technology.');

INSERT INTO AIRLINE_EXPERIENCE (title)
VALUES
('Comfort Above All'),
('Culinary Excellence'),
('Our Fleet');

INSERT INTO EXPERIENCE_DESCRIPTION (airline_experience_id, description)
VALUES
(1, 'Our aircraft are equipped with ergonomically designed seats, providing optimal comfort even on long-haul flights. With generous legroom and adjustable headrests, you can relax and arrive at your destination feeling refreshed.'),
(1, 'Premium cabins feature fully-flat beds and private suites for an unparalleled travel experience.'),
(2, 'We believe that airline food should be something to look forward to. Our menus are crafted by award-winning chefs, featuring both international favorites and local specialties from our destination countries.'),
(2, 'All meals are prepared using fresh, high-quality ingredients, with special dietary requirements accommodated with advance notice.'),
(3, 'Our fleet consists of modern, fuel-efficient aircraft designed for comfort and sustainability. Each aircraft is equipped with the latest technology to ensure a smooth and enjoyable flight.'),
(3, 'We continuously invest in our fleet to enhance passenger comfort and reduce our environmental impact, with a commitment to sustainability at the core of our operations.');

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


--
INSERT INTO contact_locations (location_name, des_type, address_string, phone_number, working_hours, email, location_embed_code)
VALUES
    ('Los Angeles Office', 'Branch Office', 'Los Angeles', '+8410301023', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13219.891667483433!2d-118.39967993022464!3d33.94611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b6ab5dc0d481%3A0x6075ef0a08ec2a7d!2sLos%20Angeles%20International%20Airport%20(LAX)!5e0!3m2!1sen!2sus!4v1650123456789!5m2!1sen!2sus'),
    ('New York 2', 'Main Office', 'New York 2', '+8410301023', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304903!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1619822446442!5m2!1sen!2s'),
    ('Chicago Office', 'Branch Office', 'Chicago', '+8410301023', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.6533383913886!2d-87.62544368455809!3d41.88227087922149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca3e2d94695%3A0x4829f3cc9ca2d0de!2sMillennium%20Park!5e0!3m2!1sen!2sus!4v1650123456789!5m2!1sen!2sus'),
    ('Tokyo Office', 'Branch Office', 'Tokyo, Korea', '+841030102332', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.4330971849653!2d139.8085117152003!3d35.71014153618419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ed6f44659b9%3A0x30e534e2114c0e71!2sTokyo%20Skytree!5e0!3m2!1sen!2sjp!4v1650123456789!5m2!1sen!2sjp'),
    ('Tokyo Office', 'Branch Office', 'Tokyo, Korea', '+841030102332444', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.4330971849653!2d139.8085117152003!3d35.71014153618419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ed6f44659b9%3A0x30e534e2114c0e71!2sTokyo%20Skytree!5e0!3m2!1sen!2sjp!4v1650123456789!5m2!1sen!2sjp'),
    ('Sydney Office', 'Branch Office', 'Sydney, USA', '+84103010234', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.3736662710805!2d151.21303131571477!3d-33.856928180659004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae665e892fdd%3A0x3133f8d75a1ac251!2sSydney%20Opera%20House!5e0!3m2!1sen!2sau!4v1650123456789!5m2!1sen!2sau'),
    ('Dubai Office', 'Main Office', 'Dubai, Korea', '+8410301023324', 'Mon-Fri 9am-3pm', 'nguyendinhbang53az@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1785970160156!2d55.27251251500987!3d25.197209838364504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682829c723b9%3A0x7bf247a82876c200!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1650123456789!5m2!1sen!2sae');
## Cách chạy (vi)
Clone project:
`git clone https://github.com/bawfng04/ClaudeAirlines`

Chạy frontend:
1. `cd frontend`
2. `npm i`
3. `npm start`

Chạy backend:
1. Tạo file `.env` tương tự như file .env.example, điền vào chỗ trống mấy cái config.
2. Chạy XAMPP, lên `http://localhost/phpmyadmin` tạo cái database tương ứng như cái `.env` mới tạo.

Notes: Nhớ là set cái root trong XAMPP tới cái thư mục chứa project mới clone về.


# Flight Booking System

A modern web application for flight booking and management built with React.js and PHP. This project provides a user-friendly interface for booking flights, managing user profiles, and handling flight-related operations.

## How to start

Clone project:
`git clone https://github.com/bawfng04/ClaudeAirlines`

Install dependencies and start frontend:
1. `cd frontend`
2. `npm i`
3. `npm start`

Install dependencies and start the server
1. Create the `.env` file similar to `.env.example` file and fill in the required values.
2. Start the XAMPP, go to `http://localhost/phpmyadmin` and create the database.

(Remember to set the root path in XAMPP to the project's folder)

## Components

### Frontend
- React.js
- Tailwind CSS
- Day.js
- Firebase Hosting

### Backend
- PHP
- MySQL
- MVC Architecture
- RESTful API
- Composer

## Project Structure

```
├── frontend/                # React.js frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   └── ...
│   └── public/            # Public assets
│
├── backend/               # PHP backend application
│   ├── app/
│   │   ├── controllers/  # MVC Controllers
│   │   ├── models/       # Database models
│   │   └── core/         # Core functionality
│   ├── config/           # Configuration files
│   └── public/           # Public entry point
```


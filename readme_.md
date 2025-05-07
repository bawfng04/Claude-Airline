<!-- ## Cách chạy (vi)
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
 -->

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://claude-airplanes.web.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)]()

# Claude Airlines – Flight Booking System

Claude Airlines is a modern web application for flight booking and management, built with React.js (frontend) and PHP/MySQL (backend). The project provides a seamless experience for users to search, book, and manage flights, as well as for admins to manage flight data.

Deploy: `https://claude-airplanes.web.app`

---

## Features

- **User-friendly flight search and booking**
- **Modern, responsive UI**
- **User authentication and profile management**
- **Admin dashboard for managing flights, bookings, and users**
- **Newsletter subscription**
- **SEO optimized with React Helmet**
- **RESTful API backend**
- **MVC architecture for backend**
- **Firebase Hosting for frontend deployment**

---

## Some images

<!-- ### Screenshots
![screenshot01](images/image2.png)
![screenshot02](images/image3.png)
![screenshot03](images/image4.png)
![screenshot04](images/image5.png)
![screenshot05](images/image6.png)
![screenshot06](images/image7.png)
![screenshot07](images/image8.png)
![screenshot08](images/image9.png)
![screenshot09](images/image10.png)
![screenshot10](images/image11.png)
![screenshot11](images/image12.png)
![screenshot12](images/image13.png) -->

### Screenshots

| ![screenshot01](images/image2.png) | ![screenshot02](images/image3.png) | ![screenshot03](images/image4.png) |
|:---:|:---:|:---:|
| ![screenshot04](images/image5.png) | ![screenshot05](images/image6.png) | ![screenshot06](images/image7.png) |
| ![screenshot07](images/image8.png) | ![screenshot08](images/image9.png) | ![screenshot09](images/image10.png) |
| ![screenshot10](images/image11.png) | ![screenshot11](images/image12.png) | ![screenshot12](images/image13.png) |

### Database diagram:
![DatabaseDiagram](images/Diagram.png)

## Technologies Used

### Frontend

- React.js
- Tailwind CSS
- React Helmet (for SEO)
- React Icons
- Firebase Hosting

### Backend

- PHP (MVC structure)
- MySQL
- RESTful API

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bawfng04/ClaudeAirlines
cd ClaudeAirlines
```

### 2. Setup the Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Setup the Backend

- Copy `.env.example` to `.env` and fill in your database credentials.
- Start XAMPP (or any local server with PHP & MySQL).
- Go to `http://localhost/phpmyadmin` and create a database matching your `.env` config.
- Set the document root in XAMPP to the backend's public directory if needed.

### 4. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost/backend/public](http://localhost/backend/public) (adjust path as needed)

---

## Project Structure

```
├── frontend/                # React.js frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Static assets (images, logos, etc.)
│   └── public/             # Public assets (index.html, favicon, etc.)
│
├── backend/                 # PHP backend application
│   ├── app/
│   │   ├── controllers/    # MVC Controllers
│   │   ├── models/         # Database models
│   │   └── core/           # Core functionality
│   ├── config/             # Configuration files
│   └── public/             # Public entry point
```

---

## SEO & Best Practices

- Uses React Helmet for dynamic meta tags and SEO optimization.
- Includes `sitemap.xml` and `robots.txt` in the frontend `public/` directory.
- All images use descriptive `alt` attributes.
- Clean, semantic HTML structure.

---


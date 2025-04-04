# Flight Booking System

A modern web application for flight booking and management built with React.js and PHP. This project provides a user-friendly interface for booking flights, managing user profiles, and handling flight-related operations.

## Features

- **User Authentication**
  - User registration and login
  - Profile management
  - Secure password handling

- **Flight Booking**
  - Search and filter flights
  - Booking management
  - Seat selection
  - Payment integration

- **User Dashboard**
  - View booking history
  - Manage personal information
  - Flight status tracking
  - Membership card management

## Tech Stack

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

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PHP 7.4 or higher
- MySQL
- Composer

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Configure environment variables
cp .env.example .env
```

Configure your database credentials in the `.env` file.

## Color Scheme

The application uses a professional color palette:

- Primary Color: `#8B0000` (Dark Red)
- Secondary Colors:
  - `#66CDAA` (Light Sea Green)
  - `#4682B4` (Steel Blue)
  - `#FFD700` (Gold)
- Neutral Colors:
  - `#D3D3D3` (Light Gray)
  - `#FFFFFF` (White)
  - `#000000` (Black)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- [Day.js](https://day.js.org/) for date handling
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for hosting

## Contact

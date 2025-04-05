# LuxeDrive - Premium Car Rental Service

A modern web application for luxury car rentals, offering a seamless booking experience for customers seeking premium vehicles.

## Features

### User Authentication
- Secure login and registration system
- Admin dashboard for inventory management
- Token-based authentication

### Car Management
- Browse available luxury vehicles
- Real-time inventory tracking
- Detailed car specifications
- Image upload for new vehicles

### Booking System
- Easy-to-use booking interface
- Real-time availability checking
- Secure payment processing
- Booking history tracking

### Admin Features
- Add new vehicles to fleet
- Manage car inventory
- Track bookings
- Restock vehicles
- Multi-admin support with secure registration
- Role-based access control
- Email notifications for customer inquiries

### Contact System
- User-friendly contact form
- Automated email notifications to admins
- Customer inquiry tracking
- Real-time message delivery
- Support ticket management

## Configuration
Create a `.env` file in the root directory and add the necessary environment variables:

```plaintext
MONGODB_URI=mongodb://127.0.0.1:27017/luxedrive
JWT_SECRET=your_jwt_secret_key
PORT=5000
ADMIN_REGISTRATION_KEY=132456789
EMAIL_USER=Your_email
EMAIL_PASS=your_email_password
```

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Web browser

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd luxedrive

# Install dependencies
npm install

# Start the server
npm start
```

## Usage

### Customer Interface
- Visit the homepage to browse available cars
- Register/Login to make bookings
- View booking history and manage reservations

### Admin Interface
- Access admin dashboard at `/admin.html`
- Add new vehicles to the fleet
- Manage inventory and stock levels
- Monitor bookings and user activities

## Admin Registration

### Security
- Secure admin registration system
- Protected by registration key
- Role-based authentication
- Individual admin accounts with tracking

### Admin Privileges
- Full inventory management
- User booking oversight
- Stock management
- System configuration access

### Registration Process
- Access admin registration at `/admin-register.html`
- Requires authorized admin registration key
- Collects essential admin information:
  - Full Name
  - Email
  - Password
  - Contact Details
  - Address


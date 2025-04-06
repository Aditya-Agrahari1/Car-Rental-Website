const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS and JSON middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with proper options
mongoose.connect('mongodb://localhost:27017/luxedrive', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});


const authRoutes = require('./routes/auth.routes');
const carRoutes = require('./routes/car.routes');
const bookingRoutes = require('./routes/booking.routes');
const contactRoutes = require('./routes/contact.routes');
app.use('/api/contact', contactRoutes);
const paymentRoutes = require('./routes/payment.routes');


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// API error handler
app.use('/api/*', (err, req, res, next) => {
    console.error('API Error:', err);
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        status: err.status || 500
    });
});

// Static files
app.use(express.static(path.join(__dirname)));

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Don't Forget to Star the Repo ⭐ [https://github.com/Aditya-Agrahari1/Car-Rental-Website]
// #Support OpenSource

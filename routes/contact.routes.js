const router = require('express').Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Create Contact model using the existing database connection
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Handle contact form submission
router.post('/submit', async (req, res) => {
    try {
        // Save to database
        const contact = new Contact(req.body);
        await contact.save();

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to the same email
            subject: `New Contact Form Submission: ${req.body.subject}`,
            text: `
                Name: ${req.body.name}
                Email: ${req.body.email}
                Subject: ${req.body.subject}
                Message: ${req.body.message}
            `
        });

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;
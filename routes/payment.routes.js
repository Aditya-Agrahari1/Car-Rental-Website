const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('luxedrive');
        console.log('Connected to MongoDB in payment routes');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

router.post('/process', async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Update booking status
        const result = await db.collection('bookings').updateOne(
            { _id: new ObjectId(bookingId) },
            { 
                $set: { 
                    status: 'paid',
                    paymentDate: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            throw new Error('Booking not found');
        }

        res.json({ success: true, message: 'Payment processed successfully' });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ success: false, message: 'Payment processing failed' });
    }
});

module.exports = router;
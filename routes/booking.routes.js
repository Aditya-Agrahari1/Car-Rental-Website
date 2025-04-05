const router = require('express').Router();
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Initialize database connection
async function connectDB() {
    try {
        await client.connect();
        db = client.db('luxedrive');
        console.log('Connected to MongoDB in booking routes');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

// Create a new booking
router.post('/create', async (req, res) => {
    try {
        // Get car details for price calculation
        const car = await db.collection('cars').findOne(
            { _id: new ObjectId(req.body.carId) }
        );

        if (!car) {
            throw new Error('Car not found');
        }

        // Calculate total days
        const pickupDate = new Date(req.body.pickupDate);
        const returnDate = new Date(req.body.returnDate);
        const totalDays = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));

        // Calculate total amount
        let totalAmount = car.price * totalDays;

        // Add service charges
        if (req.body.services) {
            if (req.body.services.insurance) totalAmount += 30 * totalDays;
            if (req.body.services.gps) totalAmount += 10 * totalDays;
            if (req.body.services.driver) totalAmount += 100 * totalDays;
        }

        const booking = {
            ...req.body,
            carId: new ObjectId(req.body.carId),
            totalAmount: totalAmount,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'pending'
        };

        const result = await db.collection('bookings').insertOne(booking);
        
        if (result.acknowledged) {
            // Update car availability using new ObjectId
            await db.collection('cars').updateOne(
                { _id: new ObjectId(req.body.carId) },
                { $inc: { quantity: -1 } }
            );
            
            res.status(201).json({ 
                _id: result.insertedId,
                ...booking 
            });
        } else {
            throw new Error('Failed to create booking');
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(400).json({ 
            message: 'Failed to create booking',
            error: error.message 
        });
    }
});

// Get user's bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await db.collection('bookings')
            .find({ userId: req.params.userId })
            .toArray();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await db.collection('bookings').findOne(
            { _id: new ObjectId(req.params.id) }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Fetch car details
        const car = await db.collection('cars').findOne(
            { _id: new ObjectId(booking.carId) }
        );

        const bookingDetails = {
            _id: booking._id,
            carName: car ? car.name : 'Unknown Car',
            pickupDate: booking.pickupDate,
            returnDate: booking.returnDate,
            totalAmount: booking.totalAmount || 0, // Ensure totalAmount is always defined
            status: booking.status
        };

        res.json(bookingDetails);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking details' });
    }
});

module.exports = router;
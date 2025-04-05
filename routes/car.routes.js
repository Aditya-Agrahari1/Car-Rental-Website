const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Initialize database connection
async function connectDB() {
    try {
        await client.connect();
        db = client.db('luxedrive');
        console.log('Connected to MongoDB in car routes');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

// Add restock route
router.post('/restock/:id', async (req, res) => {
    try {
        const carId = new ObjectId(req.params.id);
        const quantity = parseInt(req.body.quantity);

        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const result = await db.collection('cars').updateOne(
            { _id: carId },
            { 
                $inc: { quantity: quantity },
                $set: { updatedAt: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json({ message: 'Car restocked successfully' });
    } catch (error) {
        console.error('Restock error:', error);
        res.status(500).json({ message: 'Failed to restock car' });
    }
});

// Get all cars (including out of stock)
router.get('/available', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const cars = await db.collection('cars').find({}).toArray();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check car availability
router.get('/:id/availability', async (req, res) => {
    try {
        const car = await db.collection('cars').findOne({ _id: ObjectId(req.params.id) });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ 
            available: car.quantity > 0,
            car: car
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new car
router.post('/', async (req, res) => {
    try {
        const car = {
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('cars').insertOne(car);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update car quantity
router.put('/:id/update-quantity', async (req, res) => {
    try {
        const result = await db.collection('cars').findOneAndUpdate(
            { _id: ObjectId(req.params.id), quantity: { $gt: 0 } },
            { $inc: { quantity: -1 }, $set: { updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(400).json({ message: 'Car not available' });
        }

        res.json(result.value);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'images', 'cars');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        const imageUrl = `/images/cars/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image' });
    }
});

// Add new car endpoint
router.post('/add', async (req, res) => {
    try {
        const carData = req.body;
        
        // Check for duplicate car
        const existingCar = await db.collection('cars').findOne({
            name: carData.name,
            brand: carData.brand,
            model: carData.model
        });

        if (existingCar) {
            return res.status(400).json({ message: 'Car already exists' });
        }

        const result = await db.collection('cars').insertOne({
            ...carData,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ message: 'Car added successfully', carId: result.insertedId });
    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({ message: 'Error adding car' });
    }
});

// Add this new route
router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const cars = await db.collection('cars').find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } }
            ]
        }).project({
            _id: 1,
            name: 1,
            brand: 1,
            model: 1,
            price: 1
        }).limit(10).toArray();
        
        res.json(cars);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching cars' });
    }
});

module.exports = router;
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Initialize database connection
async function connectDB() {
    try {
        await client.connect();
        db = client.db('luxedrive'); // Your database name
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

// Connect to database when file is loaded
connectDB();

const cars = [
    {
        _id: ObjectId("507f1f77bcf86cd799439011"),
        name: "Mercedes-Benz S-Class",
        type: "Luxury",
        price: 200,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        quantity: 3,
        image: "mercedes-s.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439012"),
        name: "BMW 7 Series",
        type: "Luxury",
        price: 180,
        seats: 5,
        transmission: "Automatic",
        fuel: "Hybrid",
        quantity: 2,
        image: "bmw-7.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439013"),
        name: "Audi Q8",
        type: "SUV",
        price: 170,
        seats: 7,
        transmission: "Automatic",
        fuel: "Diesel",
        quantity: 4,
        image: "audi-q8.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439014"),
        name: "Porsche 911",
        type: "Sports",
        price: 250,
        seats: 2,
        transmission: "Manual",
        fuel: "Petrol",
        quantity: 1,
        image: "porsche-911.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439015"),
        name: "Range Rover Sport",
        type: "SUV",
        price: 190,
        seats: 7,
        transmission: "Automatic",
        fuel: "Diesel",
        quantity: 3,
        image: "range-rover.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439016"),
        name: "Porsche Cayenne",
        type: "SUV",
        price: 220,
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        quantity: 0,  // Starting with 0 quantity to show as out of stock
        image: "porsche-cayenne.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Initialize the cars collection if it's empty
async function initializeCars() {
    try {
        const count = await db.collection('cars').countDocuments();
        if (count === 0) {
            await db.collection('cars').insertMany(cars);
            console.log('Cars data initialized');
        }
    } catch (error) {
        console.error('Error initializing cars:', error);
    }
}

// Initialize cars after connection
initializeCars();

async function updateCarAvailability(carId) {
    try {
        const result = await db.collection('cars').updateOne(
            { _id: ObjectId(carId), quantity: { $gt: 0 } },
            { $inc: { quantity: -1 }, $set: { updatedAt: new Date() } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating car availability:', error);
        return false;
    }
}

async function restockCar(carId, quantity) {
    try {
        const result = await db.collection('cars').updateOne(
            { _id: ObjectId(carId) },
            { 
                $inc: { quantity: quantity }, 
                $set: { updatedAt: new Date() }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error restocking car:', error);
        return false;
    }
}

// Example usage for restocking:
// await restockCar("507f1f77bcf86cd799439014", 5); // Restock Porsche with 5 more cars

async function getAvailableCars() {
    try {
        return await db.collection('cars')
            .find({})  // Remove the quantity filter to show all cars
            .toArray();
    } catch (error) {
        console.error('Error fetching available cars:', error);
        return [];
    }
}

module.exports = {
    getAvailableCars,
    updateCarAvailability,
    restockCar,
    initializeCars,
    db
};
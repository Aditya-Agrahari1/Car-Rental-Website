const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Initialize database connection
async function connectDB() {
    try {
        await client.connect();
        db = client.db('luxedrive');
        console.log('Connected to MongoDB in car controller');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

exports.searchCars = async (req, res) => {
    try {
        const { query } = req.body;
        const cars = await db.collection('cars').find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        
        res.json(cars);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching cars' });
    }
};
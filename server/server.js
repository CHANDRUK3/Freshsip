import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration for production
app.use(cors({
	origin: process.env.NODE_ENV === 'production' 
		? ['https://your-app-name.vercel.app'] // Replace with your actual domain
		: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://chandruk26062005_db_user:_Gn8qgUu6EJSF95@freshsip.vv6nn2h.mongodb.net/freshsip';

let cachedConnection = null;

async function connectToDatabase() {
	if (cachedConnection) {
		return cachedConnection;
	}

	try {
		console.log('Connecting to MongoDB:', MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
		const connection = await mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 15000,
			maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
		});
		console.log('MongoDB connected to:', connection.connection.db.databaseName);
		cachedConnection = connection;
		return connection;
	} catch (err) {
		console.error('Failed to connect to MongoDB:', err);
		throw err;
	}
}

app.get('/', (req, res) => {
	res.json({ status: 'ok', service: 'FreshSip API' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
	const PORT = process.env.PORT || 5000;
	
	connectToDatabase().then(() => {
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	}).catch(err => {
		console.error('Failed to start server:', err);
		process.exit(1);
	});
}

// For Vercel serverless
export default async function handler(req, res) {
	await connectToDatabase();
	return app(req, res);
}




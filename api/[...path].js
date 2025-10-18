import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from '../server/routes/orderRoutes.js';
import authRoutes from '../server/routes/authRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration for production
app.use(cors({
	origin: '*', // Allow all origins for now, update with your domain later
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

let cachedConnection = null;

async function connectToDatabase() {
	if (cachedConnection) {
		return cachedConnection;
	}

	try {
		const connection = await mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 15000,
			maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
		});
		console.log('MongoDB connected');
		cachedConnection = connection;
		return connection;
	} catch (err) {
		console.error('Failed to connect to MongoDB:', err);
		throw err;
	}
}

app.get('/api', (req, res) => {
	res.json({ status: 'ok', service: 'FreshSip API' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Vercel serverless function handler
export default async function handler(req, res) {
	await connectToDatabase();
	return app(req, res);
}

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
	origin: ['https://freshsip-np5z.vercel.app', 'https://freshsip-jfsd.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB with fallback
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://chandruk26062005_db_user:_Gn8qgUu6EJSF95@freshsip.vv6nn2h.mongodb.net/freshsip';

let cachedConnection = null;

async function connectToDatabase() {
	if (cachedConnection) {
		return cachedConnection;
	}

	try {
		console.log('Connecting to MongoDB...');
		if (!MONGO_URI) {
			throw new Error('MongoDB URI is not configured');
		}
		
		const connection = await mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 15000,
			maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
		});
		console.log('MongoDB connected successfully');
		cachedConnection = connection;
		return connection;
	} catch (err) {
		console.error('Failed to connect to MongoDB:', err);
		throw new Error('Database connection failed');
	}
}

app.get('/api', (req, res) => {
	res.json({ 
		status: 'ok', 
		service: 'FreshSip API',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development'
	});
});

app.get('/api/health', (req, res) => {
	res.json({ 
		status: 'healthy',
		database: cachedConnection ? 'connected' : 'disconnected',
		timestamp: new Date().toISOString()
	});
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Vercel serverless function handler
export default async function handler(req, res) {
	// Essential CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	
	// Handle preflight OPTIONS requests
	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}
	
	try {
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
		
		// Connect to database
		await connectToDatabase();
		
		// Pass to Express app
		return app(req, res);
		
	} catch (error) {
		console.error('Handler error:', error);
		
		// Ensure we always send a response
		if (!res.headersSent) {
			return res.status(500).json({ 
				error: 'Server error',
				message: error.message || 'Something went wrong'
			});
		}
	}
}

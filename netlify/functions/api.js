import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

// Import routes
import orderRoutes from '../../server/routes/orderRoutes.js';
import authRoutes from '../../server/routes/authRoutes.js';
import productRoutes from '../../server/routes/productRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
	origin: ['http://localhost:3000', 'http://localhost:5173', 'https://freshsip-wv2k.netlify.app', '*'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://chandruk26062005_db_user:_Gn8qgUu6EJSF95@freshsip.vv6nn2h.mongodb.net/freshsip';

let cachedConnection = null;

async function connectToDatabase() {
	if (cachedConnection) {
		return cachedConnection;
	}

	try {
		console.log('Connecting to MongoDB for Netlify...');
		const connection = await mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 15000,
			maxPoolSize: 1,
		});
		console.log('MongoDB connected successfully');
		cachedConnection = connection;
		return connection;
	} catch (err) {
		console.error('MongoDB connection failed:', err);
		throw err;
	}
}

// Health check
app.get('/health', (req, res) => {
	res.json({ 
		status: 'healthy',
		service: 'FreshSip API - Netlify',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development'
	});
});

// Routes
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
	res.json({ 
		status: 'ok',
		service: 'FreshSip API - Netlify Functions',
		timestamp: new Date().toISOString()
	});
});

// Connect to database before handling requests
app.use(async (req, res, next) => {
	try {
		await connectToDatabase();
		next();
	} catch (error) {
		console.error('Database connection error:', error);
		res.status(500).json({ 
			error: 'Database connection failed',
			message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
		});
	}
});

// Export for Netlify Functions
export const handler = serverless(app);

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
	// Return cached connection if available
	if (cachedConnection && mongoose.connection.readyState === 1) {
		console.log('Using cached MongoDB connection');
		return cachedConnection;
	}

	try {
		console.log('Establishing MongoDB connection...');
		
		// Disconnect if there's a partial connection
		if (mongoose.connection.readyState !== 0) {
			await mongoose.disconnect();
		}
		
		const connection = await mongoose.connect(MONGO_URI, {
			serverSelectionTimeoutMS: 8000,
			connectTimeoutMS: 8000,
			maxPoolSize: 1,
			bufferCommands: false,
		});
		
		cachedConnection = connection;
		console.log('MongoDB connected successfully');
		return connection;
		
	} catch (err) {
		console.error('MongoDB connection failed:', err);
		cachedConnection = null;
		throw new Error(`Database connection failed: ${err.message}`);
	}
}

// Simple test route - no database required
app.get('/api', (req, res) => {
	res.json({ 
		status: 'ok', 
		service: 'FreshSip API',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
		mongoUri: MONGO_URI ? 'configured' : 'missing',
		jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing'
	});
});

app.get('/api/ping', (req, res) => {
	res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

app.get('/api/health', async (req, res) => {
	try {
		// Test database connection without caching issues
		if (mongoose.connection.readyState === 1) {
			res.json({ 
				status: 'healthy',
				database: 'connected',
				timestamp: new Date().toISOString()
			});
		} else {
			res.json({ 
				status: 'partial',
				database: 'disconnected',
				timestamp: new Date().toISOString()
			});
		}
	} catch (error) {
		res.status(500).json({ 
			status: 'unhealthy',
			database: 'error',
			error: error.message,
			timestamp: new Date().toISOString()
		});
	}
});

// Debug middleware
app.use('/api', (req, res, next) => {
	console.log(`API Route hit: ${req.method} ${req.url}`);
	next();
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Catch-all for debugging 404s
app.use('/api/*', (req, res) => {
	console.log(`404 - Route not found: ${req.method} ${req.url}`);
	res.status(404).json({
		error: 'Route not found',
		method: req.method,
		path: req.url,
		availableRoutes: ['/api/health', '/api/auth/*', '/api/products', '/api/orders/*']
	});
});

// Vercel serverless function handler
export default async function handler(req, res) {
	try {
		// Essential CORS headers
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		
		// Handle preflight OPTIONS requests
		if (req.method === 'OPTIONS') {
			return res.status(200).end();
		}
		
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
		
		// Check environment variables
		if (!MONGO_URI) {
			console.error('MONGO_URI not found');
			return res.status(500).json({ 
				error: 'Configuration error',
				message: 'Database configuration missing'
			});
		}
		
		// Connect to database with timeout
		const connectPromise = connectToDatabase();
		const timeoutPromise = new Promise((_, reject) => 
			setTimeout(() => reject(new Error('Database connection timeout')), 10000)
		);
		
		await Promise.race([connectPromise, timeoutPromise]);
		console.log('Database connection successful');
		
		// Pass to Express app
		return app(req, res);
		
	} catch (error) {
		console.error('Handler error:', error);
		
		// Always return a response to prevent FUNCTION_INVOCATION_FAILED
		try {
			if (!res.headersSent) {
				return res.status(500).json({ 
					error: 'Internal server error',
					message: process.env.NODE_ENV === 'production' ? 'Server error occurred' : error.message,
					timestamp: new Date().toISOString()
				});
			}
		} catch (responseError) {
			console.error('Failed to send error response:', responseError);
		}
	}
}

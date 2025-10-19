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
		? [
			'https://freshsip-np5z.vercel.app', 
			'https://freshsip-jfsd.vercel.app',
			'https://freshsippp.vercel.app', // User's current Vercel domain
			/\.vercel\.app$/, // Allow any Vercel domain
			/\.onrender\.com$/ // Allow Render domains (for testing)
		] 
		: true, // Allow all origins in development
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
	console.log('Root endpoint accessed');
	res.json({ status: 'ok', service: 'FreshSip API' });
});

// Add a simple test endpoint
app.get('/test', (req, res) => {
	console.log('Test endpoint accessed');
	res.json({ message: 'Server is working', timestamp: new Date().toISOString() });
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// When running on Render or local development, start the HTTP server.
// Render sets RENDER_SERVICE_ID environment variable
const shouldStartServer = process.env.RENDER_SERVICE_ID || // Render environment
                         process.env.START_SERVER === 'true' || 
                         (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production');

if (shouldStartServer) {
	const PORT = process.env.PORT || 5000;
	connectToDatabase().then(() => {
		app.listen(PORT, '0.0.0.0', () => {
			console.log(`Server running on port ${PORT}`);
			console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
		});
	}).catch(err => {
		console.error('Failed to start server:', err);
		process.exit(1);
	});
}

// Export handler for serverless platforms (Vercel). This keeps backward compatibility.
export default async function handler(req, res) {
	try {
		await connectToDatabase();
	} catch (err) {
		console.error('Database connection failed in serverless handler:', err);
		res.statusCode = 500;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ error: 'Database connection failed' }));
		return;
	}
	return app(req, res);
}




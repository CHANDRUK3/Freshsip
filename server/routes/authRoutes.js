import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chan26';

function sign(user) {
	const payload = { id: user._id, email: user.email, role: user.role, name: user.name };
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
	try {
		console.log('Signup request received:', req.body);
		const { name, email, password, role } = req.body;
		
		// Validate required fields
		if (!name || !email || !password) {
			console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
			return res.status(400).json({ message: 'Missing required fields' });
		}
		
		// Check if user already exists
		console.log('Checking if user exists:', email);
		const existing = await User.findOne({ email });
		if (existing) {
			console.log('User already exists:', email);
			return res.status(409).json({ message: 'Email already in use' });
		}
		
		// Create new user
		console.log('Creating new user:', { name, email, role });
		const user = await User.create({ 
			name, 
			email, 
			password, 
			role: role === 'admin' ? 'admin' : 'user' 
		});
		
		console.log('User created successfully:', user._id);
		const token = sign(user);
		
		return res.status(201).json({ 
			token, 
			user: { 
				id: user._id, 
				name: user.name, 
				email: user.email, 
				role: user.role 
			} 
		});
	} catch (err) {
		console.error('Signup error:', err);
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = sign(user);
		return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
});

export default router;



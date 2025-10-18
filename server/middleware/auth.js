import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'chan26';

export function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) {
		return res.status(401).json({ message: 'Access denied. No token provided.' });
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		return next();
	} catch (err) {
		console.error('JWT verification error:', err.message);
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token expired' });
		}
		return res.status(401).json({ message: 'Invalid token' });
	}
}

export function isAdmin(req, res, next) {
	if (req.user && req.user.role === 'admin') return next();
	return res.status(403).json({ message: 'Forbidden' });
}



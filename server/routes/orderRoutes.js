import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
	try {
		console.log('Creating new order:', req.body);
		
		const { name, email, product, quantity, address, productId, productImage, price, totalPrice } = req.body;
		
		// Validate required fields
		if (!name || !email || !quantity || !address || !product) {
			console.log('Missing required fields:', { name: !!name, email: !!email, quantity: !!quantity, address: !!address, product: !!product });
			return res.status(400).json({ message: 'Missing required fields: name, email, product, quantity, and address are required' });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: 'Invalid email format' });
		}

		// Validate quantity
		if (quantity < 1 || !Number.isInteger(quantity)) {
			return res.status(400).json({ message: 'Quantity must be a positive integer' });
		}
		
		// Generate unique order ID
		const orderId = `FS${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
		
		const orderData = {
			name: name.trim(),
			email: email.toLowerCase().trim(),
			product,
			quantity: parseInt(quantity),
			address: address.trim(),
			status: 'Pending',
			productImage: productImage || '/images/classic-orange.png',
			price: parseFloat(price) || 0,
			totalPrice: parseFloat(totalPrice) || (parseFloat(price) * parseInt(quantity)),
			orderId,
		};

		console.log('Creating order with data:', orderData);
		const order = await Order.create(orderData);
		console.log('Order created successfully:', order._id);
		
		return res.status(201).json({
			message: 'Order placed successfully',
			orderId: order.orderId,
			...order.toObject()
		});
	} catch (err) {
		console.error('Error creating order:', err);
		return res.status(500).json({ 
			message: 'Failed to place order. Please try again.', 
			error: process.env.NODE_ENV === 'development' ? err.message : undefined 
		});
	}
});

// GET /api/orders - Admin: get all orders (admin only)
router.get('/', authMiddleware, isAdmin, async (_req, res) => {
	try {
		const orders = await Order.find({}).sort({ createdAt: -1 });
		return res.json(orders);
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// GET /api/orders/:email - Fetch orders by email
router.get('/:email', async (req, res) => {
	try {
		const { email } = req.params;
		console.log('Fetching orders for email:', email);
		
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: 'Invalid email format' });
		}
		
		const orders = await Order.find({ 
			email: email.toLowerCase().trim() 
		}).sort({ createdAt: -1 });
		
		console.log(`Found ${orders.length} orders for email: ${email}`);
		return res.json(orders);
	} catch (err) {
		console.error('Error fetching orders:', err);
		return res.status(500).json({ 
			message: 'Failed to fetch orders. Please try again.', 
			error: process.env.NODE_ENV === 'development' ? err.message : undefined 
		});
	}
});

// PUT /api/orders/:id/status - Update status (Admin only)
router.put('/:id/status', authMiddleware, isAdmin, async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		
		console.log(`Admin ${req.user.email} updating order ${id} to status: ${status}`);
		
		// Validate status
		const validStatuses = ['Pending', 'Preparing', 'Ready to Deliver', 'Completed'];
		if (!status || !validStatuses.includes(status)) {
			return res.status(400).json({ 
				message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') 
			});
		}
		
		const updated = await Order.findByIdAndUpdate(
			id,
			{ 
				status,
				updatedAt: new Date()
			},
			{ new: true, runValidators: true }
		);
		
		if (!updated) {
			return res.status(404).json({ message: 'Order not found' });
		}
		
		console.log(`Order ${id} status updated to: ${status}`);
		return res.json({
			message: 'Order status updated successfully',
			order: updated
		});
	} catch (err) {
		console.error('Error updating order status:', err);
		return res.status(500).json({ 
			message: 'Failed to update order status. Please try again.', 
			error: process.env.NODE_ENV === 'development' ? err.message : undefined 
		});
	}
});

export default router;



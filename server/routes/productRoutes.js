import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
	try {
		const { 
			category, 
			sort = 'featured', 
			page = 1, 
			limit = 12, 
			search,
			minPrice,
			maxPrice 
		} = req.query;

		// Build filter object
		const filter = {};
		if (category && category !== 'all') filter.category = category;
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } }
			];
		}
		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) filter.price.$gte = Number(minPrice);
			if (maxPrice) filter.price.$lte = Number(maxPrice);
		}

		// Build sort object
		let sortObj = {};
		switch (sort) {
			case 'featured':
				sortObj = { featured: -1, createdAt: -1 };
				break;
			case 'best_selling':
				sortObj = { bestSelling: -1, createdAt: -1 };
				break;
			case 'alphabetical':
				sortObj = { name: 1 };
				break;
			case 'price_asc':
				sortObj = { price: 1 };
				break;
			case 'price_desc':
				sortObj = { price: -1 };
				break;
			case 'newest':
				sortObj = { createdAt: -1 };
				break;
			default:
				sortObj = { featured: -1, createdAt: -1 };
		}

		// Calculate pagination
		const skip = (Number(page) - 1) * Number(limit);

		// Get products and total count
		const [products, total] = await Promise.all([
			Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
			Product.countDocuments(filter)
		]);

		const totalPages = Math.ceil(total / Number(limit));

		res.json({
			products,
			pagination: {
				currentPage: Number(page),
				totalPages,
				totalProducts: total,
				hasNext: Number(page) < totalPages,
				hasPrev: Number(page) > 1
			}
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Product not found' });
		res.json(product);
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

export default router;

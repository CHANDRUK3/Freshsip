import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
	{
		name: "The Golden Squeeze Orange Juice",
		imageURL: "/images/orange-juice-home.png",
		category: "Juice",
		size: "500ml",
		weight: "Pack of 6",
		price: 24.99,
		discount: 15,
		originalPrice: 29.99,
		description: "Freshly squeezed orange juice made from premium oranges. No additives, just pure natural goodness.",
		availableSizes: ["250ml", "500ml", "1L"],
		stock: 50,
		featured: true,
		bestSelling: true
	},
	{
		name: "Ginger Zest Juice",
		imageURL: "/images/ginger-zest-juice.png",
		category: "Juice",
		size: "350ml",
		weight: "Pack of 4",
		price: 18.99,
		discount: 0,
		description: "Refreshing blend of orange juice with a zesty kick of ginger. Perfect for a healthy morning boost.",
		availableSizes: ["250ml", "350ml"],
		stock: 30,
		featured: true,
		bestSelling: false
	},
	{
		name: "Mango Tango Fresh Blend",
		imageURL: "/images/mango-tango-juice.png",
		category: "Juice",
		size: "400ml",
		weight: "Pack of 6",
		price: 22.99,
		discount: 20,
		originalPrice: 28.99,
		description: "Tropical mango juice blended to perfection. Sweet, smooth, and naturally delicious.",
		availableSizes: ["250ml", "400ml", "750ml"],
		stock: 40,
		featured: false,
		bestSelling: true
	},
	{
		name: "Pineapple Sunrise",
		imageURL: "/images/pineapple-sunrise-juice.png",
		category: "Juice",
		size: "450ml",
		weight: "Pack of 4",
		price: 20.99,
		discount: 10,
		originalPrice: 23.99,
		description: "Bright and tangy pineapple juice that brings sunshine to your day. Pure tropical goodness.",
		availableSizes: ["300ml", "450ml"],
		stock: 35,
		featured: false,
		bestSelling: false
	},
	{
		name: "Classic Orange Juice",
		imageURL: "/images/classic-orange.png",
		category: "Juice",
		size: "250ml",
		weight: "Pack of 12",
		price: 16.99,
		discount: 0,
		description: "Traditional orange juice made from hand-picked oranges. Classic taste you'll love.",
		availableSizes: ["250ml", "500ml"],
		stock: 60,
		featured: false,
		bestSelling: true
	},
	{
		name: "Mixed Fruit Combo",
		imageURL: "/images/mixed-fruit-combo.png",
		category: "Combos",
		size: "Variety Pack",
		weight: "Pack of 8",
		price: 35.99,
		discount: 25,
		originalPrice: 47.99,
		description: "Perfect variety pack with our best-selling juices. Great value for the whole family.",
		availableSizes: ["Variety Pack"],
		stock: 25,
		featured: true,
		bestSelling: true
	},
	{
		name: "Pure Coconut Water",
		imageURL: "/images/coconut-water.png",
		category: "Coconut Water",
		size: "330ml",
		weight: "Pack of 6",
		price: 19.99,
		discount: 0,
		description: "100% pure coconut water, naturally refreshing and hydrating. Straight from young coconuts.",
		availableSizes: ["250ml", "330ml", "500ml"],
		stock: 45,
		featured: false,
		bestSelling: false
	},
	{
		name: "Premium Orange Deluxe",
		imageURL: "/images/orange-juice-home.png",
		category: "Juices",
		size: "1L",
		weight: "Pack of 2",
		price: 32.99,
		discount: 0,
		description: "Premium grade orange juice with pulp. Made from the finest oranges for an authentic taste.",
		availableSizes: ["500ml", "1L"],
		stock: 20,
		featured: true,
		bestSelling: false
	}
];

async function seedProducts() {
	try {
		await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/freshsip');
		console.log('Connected to MongoDB');

		// Clear existing products
		await Product.deleteMany({});
		console.log('Cleared existing products');

		// Insert sample products
		await Product.insertMany(sampleProducts);
		console.log('Inserted sample products');

		console.log('Seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('Seeding failed:', error);
		process.exit(1);
	}
}

seedProducts();

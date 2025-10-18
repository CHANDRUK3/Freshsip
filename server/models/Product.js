import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		imageURL: { type: String, required: true },
		category: { type: String, required: true, enum: ['Juice', 'Juices', 'Coconut Water', 'Combos'], default: 'Juice' },
		size: { type: String, required: true }, // e.g., "250ml", "500ml", "1L"
		weight: { type: String }, // e.g., "Pack of 6", "Pack of 12"
		price: { type: Number, required: true, min: 0 },
		discount: { type: Number, min: 0, max: 100, default: 0 }, // percentage
		originalPrice: { type: Number }, // for discounted items
		description: { type: String, required: true },
		availableSizes: [{ type: String }], // array of available sizes
		stock: { type: Number, default: 0 },
		featured: { type: Boolean, default: false },
		bestSelling: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;

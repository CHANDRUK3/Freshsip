import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, lowercase: true, index: true },
		product: { type: String, required: true, default: 'Classic Orange Juice' },
		quantity: { type: Number, required: true, min: 1 },
		address: { type: String, required: true },
		status: { 
			type: String, 
			default: 'Pending', 
			enum: ['Pending', 'Preparing', 'Ready to Deliver', 'Completed'] 
		},
		productImage: { type: String, default: '/images/classic-orange.png' },
		price: { type: Number, default: 0 },
		totalPrice: { type: Number, default: 0 },
		orderId: { type: String, unique: true, sparse: true },
	},
	{ timestamps: { createdAt: true, updatedAt: true } }
);

const Order = mongoose.model('Order', OrderSchema);
export default Order;



import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000';

export default function OrderModal({ open, onClose, product }) {
	const user = getUser();
	const [form, setForm] = useState({ 
		name: '', 
		email: '', 
		quantity: 1, 
		address: '' 
	});
	const [loading, setLoading] = useState(false);

	// Auto-fill user data when modal opens
	useEffect(() => {
		if (open && user) {
			setForm(prev => ({
				...prev,
				name: user.name || '',
				email: user.email || ''
			}));
		}
	}, [open, user]);

	if (!open || !product) return null;

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: name === 'quantity' ? Math.max(1, Number(value)) : value }));
	}

	const totalPrice = product.price * form.quantity;

	async function submitOrder(e) {
		e.preventDefault();
		
		if (!form.name || !form.email || !form.address) {
			toast.error('Please fill all required fields');
			return;
		}

		setLoading(true);
		try {
			const orderData = {
				name: form.name,
				email: form.email,
				product: product.name,
				quantity: form.quantity,
				address: form.address,
				productImage: product.image,
				price: product.price,
				totalPrice: totalPrice
			};

			const res = await fetch(`${API_BASE}/api/orders`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData),
			});
			
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to place order');
			
			toast.success(`Order placed successfully! Order ID: ${data.orderId}`);
			setForm({ name: '', email: '', quantity: 1, address: '' });
			onClose();
		} catch (err) {
			toast.error(err.message || 'Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<AnimatePresence>
			{open && (
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
					onClick={onClose}
				>
					<motion.div 
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="bg-white rounded-xl w-full max-w-lg shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Product Header */}
						<div className="flex items-center gap-4 p-6 border-b">
							<img 
								src={product.image} 
								alt={product.name}
								className="w-16 h-16 object-cover rounded-lg"
								onError={(e) => {
									e.target.src = '/images/classic-orange.png';
								}}
							/>
							<div className="flex-1">
								<h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
								<p className="text-gray-600 text-sm">{product.description}</p>
								<p className="text-orange-600 font-semibold">₹{product.price} per bottle</p>
							</div>
							<button 
								onClick={onClose} 
								className="text-gray-400 hover:text-gray-600 text-2xl"
							>
								×
							</button>
						</div>

						{/* Order Form */}
						<form onSubmit={submitOrder} className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
									<input 
										name="name" 
										placeholder="Your name" 
										value={form.name} 
										onChange={handleChange} 
										required 
										className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition" 
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
									<input 
										type="email" 
										name="email" 
										placeholder="your@email.com" 
										value={form.email} 
										onChange={handleChange} 
										required 
										className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition" 
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={() => setForm(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
										className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
									>
										−
									</button>
									<input 
										type="number" 
										min="1" 
										name="quantity" 
										value={form.quantity} 
										onChange={handleChange} 
										required 
										className="w-20 text-center border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition" 
									/>
									<button
										type="button"
										onClick={() => setForm(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
										className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
									>
										+
									</button>
									<span className="text-gray-600 ml-2">× ₹{product.price} = ₹{totalPrice}</span>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
								<textarea 
									name="address" 
									placeholder="Enter your complete address..." 
									value={form.address} 
									onChange={handleChange} 
									required 
									rows={3}
									className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition resize-none" 
								/>
							</div>

							{/* Order Summary */}
							<div className="bg-orange-50 rounded-lg p-4">
								<div className="flex justify-between items-center text-lg font-semibold">
									<span>Total Amount:</span>
									<span className="text-orange-600">₹{totalPrice}</span>
								</div>
								<p className="text-sm text-gray-600 mt-1">Cash on Delivery • Free delivery above ₹500</p>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button 
									type="button"
									onClick={onClose}
									className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition font-medium"
								>
									Cancel
								</button>
								<button 
									type="submit"
									disabled={loading || !form.name || !form.email || !form.address} 
									className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-medium"
								>
									{loading ? 'Placing Order...' : 'Confirm Order'}
								</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}



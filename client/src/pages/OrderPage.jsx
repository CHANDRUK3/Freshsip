import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000';

export default function OrderPage() {
	const { productId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [orderLoading, setOrderLoading] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		address: ''
	});

	useEffect(() => {
		// Get product from location state or fetch from API
		if (location.state?.product) {
			setProduct(location.state.product);
			setLoading(false);
		} else {
			fetchProduct();
		}
	}, [productId, location.state]);

	const fetchProduct = async () => {
		try {
			const response = await fetch(`${API_BASE}/api/products/${productId}`);
			const data = await response.json();
			if (response.ok) {
				setProduct(data);
			} else {
				toast.error('Product not found');
				navigate('/juices');
			}
		} catch (error) {
			toast.error('Error loading product');
			navigate('/juices');
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleOrderSubmit = async (e) => {
		e.preventDefault();
		setOrderLoading(true);

		try {
			const orderData = {
				name: formData.name,
				email: formData.email,
				address: formData.address,
				product: product.name,
				quantity: quantity,
				productId: product._id,
				productImage: product.imageURL,
				price: product.price,
				totalPrice: parseFloat(totalPrice)
			};

			const response = await fetch(`${API_BASE}/api/orders`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData)
			});

			const data = await response.json();
			if (response.ok) {
				toast.success('Order placed successfully!');
				// Show confirmation modal
				setTimeout(() => {
					navigate('/', { state: { showConfirmation: true, orderId: data._id } });
				}, 1500);
			} else {
				toast.error(data.message || 'Failed to place order');
			}
		} catch (error) {
			toast.error('Error placing order');
		} finally {
			setOrderLoading(false);
		}
	};

	const totalPrice = product ? (product.price * quantity).toFixed(2) : 0;
	const isFormValid = formData.name && formData.email && formData.address;

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
					<button 
						onClick={() => navigate('/juices')}
						className="bg-orange-500 text-white px-6 py-2 rounded-lg"
					>
						Back to Juices
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50">
			<Toaster />
			
			<div className="container mx-auto px-4 py-8">
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-6xl mx-auto"
				>
					{/* Product Details Section */}
					<div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
						<div className="grid md:grid-cols-2 gap-0">
							{/* Product Image */}
							<motion.div 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="p-8 bg-gray-50 flex items-center justify-center"
							>
								<img 
									src={product.imageURL} 
									alt={product.name}
									className="w-full max-w-md h-96 object-contain drop-shadow-lg"
								/>
							</motion.div>

							{/* Product Info */}
							<motion.div 
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className="p-8 flex flex-col justify-center"
							>
								<h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
								<p className="text-gray-600 mb-4">{product.description}</p>
								
								<div className="flex items-center gap-4 mb-6">
									<span className="text-3xl font-bold text-orange-600">${product.price}</span>
									{product.discount > 0 && (
										<span className="text-lg text-gray-500 line-through">
											${product.originalPrice || product.price}
										</span>
									)}
									{product.discount > 0 && (
										<span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
											{product.discount}% OFF
										</span>
									)}
								</div>

								{/* Quantity and Total */}
								<div className="mb-6">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Quantity
									</label>
									<div className="flex items-center gap-4">
										<button 
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
										>
											-
										</button>
										<span className="text-xl font-semibold w-12 text-center">{quantity}</span>
										<button 
											onClick={() => setQuantity(quantity + 1)}
											className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
										>
											+
										</button>
									</div>
								</div>

								<div className="border-t pt-6">
									<div className="flex justify-between items-center mb-4">
										<span className="text-lg font-semibold">Total:</span>
										<span className="text-2xl font-bold text-orange-600">${totalPrice}</span>
									</div>
								</div>
							</motion.div>
						</div>
					</div>

					{/* Order Form */}
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="bg-white rounded-2xl shadow-xl p-8"
					>
						<h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h2>
						
						<form onSubmit={handleOrderSubmit} className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name *
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
										placeholder="Enter your full name"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email Address *
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
										placeholder="Enter your email"
									/>
								</div>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Delivery Address *
								</label>
								<textarea
									name="address"
									value={formData.address}
									onChange={handleInputChange}
									required
									rows={4}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
									placeholder="Enter your complete delivery address"
								/>
							</div>

							<div className="flex gap-4">
								<button
									type="button"
									onClick={() => navigate('/juices')}
									className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
								>
									Back to Juices
								</button>
								<button
									type="submit"
									disabled={!isFormValid || orderLoading}
									className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
								>
									{orderLoading ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
											Processing...
										</div>
									) : (
										'Order Now'
									)}
								</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

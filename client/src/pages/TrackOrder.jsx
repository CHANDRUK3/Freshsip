import React, { useState, useEffect, useCallback } from 'react';
import { getUser } from '../utils/auth';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_BASE } from '../utils/api';

export default function TrackOrder() {
	const user = getUser();
	const [email, setEmail] = useState(user?.email || '');
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [autoRefresh, setAutoRefresh] = useState(true);

	const handleFetch = useCallback(async function(emailToFetch = email, silent = false) {
		if (!silent) setLoading(true);
		setError('');
		
		try {
			const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(emailToFetch)}`);
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data.message || 'Failed to fetch orders');
			}
			
			setOrders(data);
			if (!silent && data.length === 0) {
				toast.info('No orders found for this email');
			}
		} catch (err) {
			const errorMsg = err.message;
			setError(errorMsg);
			if (!silent) {
				toast.error(errorMsg);
			}
		} finally {
			if (!silent) setLoading(false);
		}
	}, [email]);

	// Auto-fetch orders when user is logged in
	useEffect(() => {
		if (user?.email) {
			setEmail(user.email);
			handleFetch(user.email);
		}
	}, [user?.email, handleFetch]);

	// Auto-refresh orders every 30 seconds when enabled
	useEffect(() => {
		if (!autoRefresh || !email) return;
		
		const interval = setInterval(() => {
			handleFetch(email, true); // Silent refresh
		}, 30000);

		return () => clearInterval(interval);
	}, [autoRefresh, email, handleFetch]);

	const getStatusConfig = (status) => {
		const configs = {
			'Pending': { color: 'bg-gray-400', text: 'text-gray-700', progress: 25, icon: '⏳' },
			'Preparing': { color: 'bg-yellow-400', text: 'text-yellow-700', progress: 50, icon: '👨‍🍳' },
			'Ready to Deliver': { color: 'bg-blue-500', text: 'text-blue-700', progress: 75, icon: '📦' },
			'Completed': { color: 'bg-green-500', text: 'text-green-700', progress: 100, icon: '✅' }
		};
		return configs[status] || configs['Pending'];
	};

	const getTimeAgo = (dateString) => {
		const now = new Date();
		const orderDate = new Date(dateString);
		const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
		
		if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
		return `${Math.floor(diffInMinutes / 1440)} days ago`;
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<Toaster position="top-right" />
			
			{/* Header */}
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Orders</h1>
				<p className="text-gray-600">Monitor the status of your fresh juice orders in real-time</p>
			</div>

			{/* Search Section */}
			<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
						<input 
							type="email" 
							placeholder="Enter your email to track orders" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)} 
							className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition" 
						/>
					</div>
					<div className="flex items-end gap-2">
						<button 
							onClick={() => handleFetch()} 
							disabled={!email || loading} 
							className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
						>
							{loading ? 'Loading...' : 'Track Orders'}
						</button>
						<button
							onClick={() => setAutoRefresh(!autoRefresh)}
							className={`p-3 rounded-lg transition ${autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
							title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
						>
							🔄
						</button>
					</div>
				</div>
			</div>

			{/* Orders List */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p className="text-red-600 flex items-center gap-2">
						<span>⚠️</span> {error}
					</p>
				</div>
			)}

			{orders.length === 0 && !loading && !error ? (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">📦</div>
					<h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
					<p className="text-gray-500">Enter your email to track your fresh juice orders</p>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order, index) => {
						const statusConfig = getStatusConfig(order.status);
						return (
							<motion.div
								key={order._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white rounded-xl shadow-lg overflow-hidden"
							>
								{/* Order Header */}
								<div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-semibold text-lg">Order #{order.orderId || order._id.slice(-6)}</h3>
											<p className="text-orange-100">Placed {getTimeAgo(order.createdAt)}</p>
										</div>
										<div className="text-right">
											<p className="text-orange-100">Total Amount</p>
											<p className="text-xl font-bold">₹{order.totalPrice || (order.price * order.quantity)}</p>
										</div>
									</div>
								</div>

								{/* Order Details */}
								<div className="p-6">
									<div className="flex items-start gap-4 mb-6">
										<img 
											src={order.productImage || '/images/classic-orange.png'}
											alt={order.product}
											className="w-20 h-20 object-cover rounded-lg"
											onError={(e) => {
												e.target.src = '/images/classic-orange.png';
											}}
										/>
										<div className="flex-1">
											<h4 className="font-semibold text-gray-800">{order.product}</h4>
											<p className="text-gray-600">Quantity: {order.quantity} bottles</p>
											<p className="text-gray-600">Price: ₹{order.price || 0} each</p>
										</div>
										<div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig.color.replace('bg-', 'bg-opacity-20 bg-')} ${statusConfig.text}`}>
											<span>{statusConfig.icon}</span>
											<span className="font-medium">{order.status}</span>
										</div>
									</div>

									{/* Address */}
									<div className="mb-6">
										<h5 className="font-medium text-gray-700 mb-2">Delivery Address</h5>
										<p className="text-gray-600">{order.address}</p>
									</div>

									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex justify-between text-sm text-gray-600 mb-2">
											<span>Order Progress</span>
											<span>{statusConfig.progress}%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<motion.div 
												initial={{ width: 0 }}
												animate={{ width: `${statusConfig.progress}%` }}
												transition={{ duration: 1, delay: 0.5 }}
												className={`h-3 rounded-full ${statusConfig.color}`}
											/>
										</div>
									</div>

									{/* Status Steps */}
									<div className="grid grid-cols-4 gap-2 text-center text-sm">
										{['Pending', 'Preparing', 'Ready to Deliver', 'Completed'].map((step, stepIndex) => {
											const stepConfig = getStatusConfig(step);
											const isActive = stepIndex < (statusConfig.progress / 25);
											return (
												<div key={step} className={`p-2 rounded ${isActive ? stepConfig.color + ' text-white' : 'bg-gray-100 text-gray-500'}`}>
													<div>{stepConfig.icon}</div>
													<div className="text-xs mt-1">{step}</div>
												</div>
											);
										})}
									</div>

									{/* Order Info */}
									<div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
										<div className="grid grid-cols-2 gap-4">
											<div>Customer: {order.name}</div>
											<div>Email: {order.email}</div>
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}

			{autoRefresh && orders.length > 0 && (
				<div className="text-center mt-6">
					<p className="text-sm text-gray-500 flex items-center justify-center gap-2">
						<span className="animate-pulse">🔄</span>
						Auto-refreshing every 30 seconds
					</p>
				</div>
			)}
		</div>
	);
}



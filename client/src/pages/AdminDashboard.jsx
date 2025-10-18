import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getUser, clearAuth } from '../utils/auth';
import { toast, Toaster } from 'react-hot-toast';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000';

export default function AdminDashboard() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	const fetchOrders = useCallback(async function() {
		setLoading(true);
		try {
			const token = getToken();
			const res = await fetch(`${API_BASE}/api/orders`, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			
			if (res.status === 401) {
				toast.error('Session expired. Please log in again.');
				clearAuth();
				navigate('/login');
				return;
			}
			
			if (!res.ok) {
				throw new Error(`Error: ${res.status}`);
			}
			
			const data = await res.json();
			setOrders(data);
		} catch (err) {
			console.error('Fetch orders error:', err);
			toast.error('Failed to fetch orders');
		} finally {
			setLoading(false);
		}
	}, [navigate]);

	useEffect(() => {
		const currentUser = getUser();
		const token = getToken();
		
		if (!currentUser || !token || currentUser.role !== 'admin') {
			toast.error('Access denied. Admin privileges required.');
			navigate('/login');
			return;
		}
		
		setUser(currentUser);
		fetchOrders();
	}, [navigate, fetchOrders]);

	const updateStatus = useCallback(async function(id, status) {
		try {
			const token = getToken();
			const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status })
			});
			
			if (res.status === 401) {
				toast.error('Session expired. Please log in again.');
				clearAuth();
				navigate('/login');
				return;
			}
			
			if (!res.ok) {
				throw new Error(`Error: ${res.status}`);
			}
			
			toast.success(`Order status updated to ${status}`);
			fetchOrders();
		} catch (err) {
			console.error('Update status error:', err);
			toast.error('Failed to update order status');
		}
	}, [navigate, fetchOrders]);

	function handleLogout() {
		clearAuth();
		toast.success('Logged out successfully');
		navigate('/login');
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Toaster position="top-right" />
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold text-orange-800">Admin Dashboard</h1>
					<p className="text-gray-600">Welcome, {user.name}</p>
				</div>
				<div className="flex gap-2">
					<button 
						onClick={fetchOrders} 
						className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition"
						disabled={loading}
					>
						{loading ? 'Refreshing...' : 'Refresh Orders'}
					</button>
					<button 
						onClick={handleLogout}
						className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
					>
						Logout
					</button>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b">
					<h2 className="text-xl font-semibold">All Customer Orders</h2>
					<p className="text-gray-600">Total Orders: {orders.length}</p>
				</div>
				
				{loading ? (
					<div className="p-6 text-center">
						<p>Loading orders...</p>
					</div>
				) : orders.length === 0 ? (
					<div className="p-6 text-center">
						<p className="text-gray-500">No orders found</p>
					</div>
				) : (
					<div className="divide-y">
						{orders.map(order => (
							<div key={order._id} className="p-6 hover:bg-gray-50 transition">
								<div className="flex justify-between items-start mb-4">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<img 
												src={order.productImage} 
												alt={order.product}
												className="w-12 h-12 object-cover rounded"
												onError={(e) => {
													e.target.src = '/images/classic-orange.png';
												}}
											/>
											<div>
												<h3 className="font-semibold text-lg">{order.product}</h3>
												<p className="text-gray-600">Quantity: {order.quantity} bottles</p>
												<p className="text-orange-600 font-medium">
													₹{order.price} × {order.quantity} = ₹{order.totalPrice || (order.price * order.quantity)}
												</p>
												{order.orderId && (
													<p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
												)}
											</div>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
											<p><span className="font-medium">Customer:</span> {order.name}</p>
											<p><span className="font-medium">Email:</span> {order.email}</p>
											<p><span className="font-medium">Address:</span> {order.address}</p>
											<p><span className="font-medium">Order ID:</span> {order.orderId || 'N/A'}</p>
										</div>
									</div>
									<div className="text-right text-sm text-gray-500">
										<p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
										<p>{new Date(order.createdAt).toLocaleTimeString()}</p>
									</div>
								</div>
								
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="text-sm font-medium">Status:</span>
										<select 
											value={order.status} 
											onChange={(e) => updateStatus(order._id, e.target.value)} 
											className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-orange-300 transition"
										>
											<option value="Pending">Pending</option>
											<option value="Preparing">Preparing</option>
											<option value="Ready to Deliver">Ready to Deliver</option>
											<option value="Completed">Completed</option>
										</select>
									</div>
									<span className={`px-3 py-1 rounded-full text-sm font-medium ${
										order.status === 'Completed' ? 'bg-green-100 text-green-800' :
										order.status === 'Ready to Deliver' ? 'bg-blue-100 text-blue-800' :
										order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
										'bg-gray-100 text-gray-800'
									}`}>
										{order.status}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import OrderModal from '../components/OrderModal';
import { toast, Toaster } from 'react-hot-toast';

export default function Shop() {
	const user = getUser();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showOrderModal, setShowOrderModal] = useState(false);

	const handleOrderClick = (product) => {
		if (!user) {
			toast.error('Please login to place an order');
			return;
		}
		setSelectedProduct(product);
		setShowOrderModal(true);
	};

	const handleCloseModal = () => {
		setShowOrderModal(false);
		setSelectedProduct(null);
	};

	const products = [
		{
			id: 1,
			name: 'Classic Orange Juice',
			image: '/images/classic-orange.png',
			price: 120,
			description: 'Fresh and tangy orange juice made from premium oranges'
		},
		{
			id: 2,
			name: 'Mango Tango Juice',
			image: '/images/mango-tango-juice.png',
			price: 150,
			description: 'Sweet and tropical mango juice'
		},
		{
			id: 3,
			name: 'Mixed Fruit Combo',
			image: '/images/mixed-fruit-combo.png',
			price: 180,
			description: 'A delightful mix of seasonal fruits'
		},
		{
			id: 4,
			name: 'Pineapple Sunrise',
			image: '/images/pineapple-sunrise-juice.png',
			price: 140,
			description: 'Refreshing pineapple juice with a tropical twist'
		},
		{
			id: 5,
			name: 'Vitamin Boost Juice',
			image: '/images/vitamin-boost-juice.png',
			price: 200,
			description: 'Power-packed juice with vitamins and minerals'
		},
		{
			id: 6,
			name: 'Coconut Water',
			image: '/images/coconut-water.png',
			price: 80,
			description: 'Natural and refreshing coconut water'
		}
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-orange-800 mb-2">
					Welcome to FreshSip Shop, {user?.name || 'Customer'}!
				</h1>
				<p className="text-gray-600">Choose from our premium collection of fresh juices</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{products.map(product => (
					<div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
						<img 
							src={product.image} 
							alt={product.name}
							className="w-full h-48 object-cover"
							onError={(e) => {
								e.target.src = '/images/classic-orange.png';
							}}
						/>
						<div className="p-6">
							<h3 className="text-xl font-semibold mb-2">{product.name}</h3>
							<p className="text-gray-600 mb-3">{product.description}</p>
							<div className="flex items-center justify-between">
								<span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
								<button 
									onClick={() => handleOrderClick(product)}
									className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition"
								>
									Order Now
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="mt-12 text-center">
				<Link 
					to="/track"
					className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition inline-block"
				>
					Track Your Orders
				</Link>
			</div>

			{/* Order Modal */}
			<OrderModal 
				open={showOrderModal}
				onClose={handleCloseModal}
				product={selectedProduct}
			/>
			
			<Toaster position="top-right" />
		</div>
	);
}

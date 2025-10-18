import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
	const navigate = useNavigate();
	const discountPrice = product.discount > 0 
		? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
		: product.price;

	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
		>
			<div className="relative">
				<img 
					src={product.imageURL} 
					alt={product.name}
					className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				{product.discount > 0 && (
					<div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-medium">
						{product.discount}% OFF
					</div>
				)}
				{product.featured && (
					<div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium">
						Featured
					</div>
				)}
				{product.bestSelling && (
					<div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
						Best Seller
					</div>
				)}
			</div>
			
			<div className="p-4">
				<h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
				<p className="text-gray-600 text-sm mb-2">{product.size}</p>
				<p className="text-gray-700 text-sm mb-3 line-clamp-2">{product.description}</p>
				
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-orange-600">${discountPrice}</span>
						{product.discount > 0 && (
							<span className="text-sm text-gray-500 line-through">${product.price}</span>
						)}
					</div>
					{product.weight && (
						<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
							{product.weight}
						</span>
					)}
				</div>
				
				<div className="flex gap-2">
					<button 
						onClick={() => navigate(`/order/${product._id}`, { state: { product } })}
						className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
					>
						Add to Cart
					</button>
					<button 
						onClick={() => onViewProduct(product)}
						className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-2 px-3 rounded text-sm font-medium transition-colors"
					>
						View
					</button>
				</div>
			</div>
		</motion.div>
	);
}

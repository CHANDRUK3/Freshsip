import React from 'react';
import { motion } from 'framer-motion';

export default function OrderConfirmationModal({ isOpen, onClose, orderId }) {
	if (!isOpen) return null;

	return (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<motion.div 
				initial={{ opacity: 0, scale: 0.8, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.8, y: 20 }}
				transition={{ type: "spring", damping: 20, stiffness: 300 }}
				className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Checkmark Animation */}
				<motion.div 
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
					className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
				>
					<motion.svg 
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ delay: 0.5, duration: 0.8 }}
						className="w-10 h-10 text-white" 
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path 
							strokeLinecap="round" 
							strokeLinejoin="round" 
							strokeWidth={3} 
							d="M5 13l4 4L19 7" 
						/>
					</motion.svg>
				</motion.div>

				<motion.h2 
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					className="text-2xl font-bold text-gray-800 mb-2"
				>
					Order Confirmed!
				</motion.h2>
				
				<motion.p 
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="text-gray-600 mb-6"
				>
					Thank you for choosing FreshSip 🍊
				</motion.p>

				{orderId && (
					<motion.div 
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9 }}
						className="bg-gray-50 rounded-lg p-4 mb-6"
					>
						<p className="text-sm text-gray-600">Order ID:</p>
						<p className="font-mono text-sm font-semibold text-gray-800">{orderId}</p>
					</motion.div>
				)}

				<motion.div 
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.0 }}
					className="flex gap-3"
				>
					<button
						onClick={onClose}
						className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
					>
						Continue Shopping
					</button>
					<button
						onClick={() => window.location.href = '/track'}
						className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 px-4 rounded-lg font-medium transition-colors"
					>
						Track Order
					</button>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

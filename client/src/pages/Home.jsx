import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import OrderModal from '../components/OrderModal';
import OrderConfirmationModal from '../components/OrderConfirmationModal';

const products = [
	{ id: 1, name: 'Classic Orange Juice', description: 'Freshly squeezed daily.', price: '$4.99', image: '/images/classic-orange.png' },
	{ id: 2, name: 'Pulp Lover', description: 'Extra pulp, extra goodness.', price: '$5.49', image: '/images/pulp-lover-juice.png' },
	{ id: 3, name: 'Vitamin Boost', description: 'Orange + Vitamin C boost.', price: '$5.99', image: '/images/vitamin-boost-juice.png' },
];

export default function Home() {
	const location = useLocation();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState('Classic Orange Juice');
	const [showConfirmation, setShowConfirmation] = React.useState(false);
	const [orderId, setOrderId] = React.useState(null);

	React.useEffect(() => {
		if (location.state?.showConfirmation) {
			setShowConfirmation(true);
			setOrderId(location.state.orderId);
			// Clear the state
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	function handleOrder(productName) {
		setSelected(productName);
		setOpen(true);
	}

	function handleCloseConfirmation() {
		setShowConfirmation(false);
		setOrderId(null);
	}
	return (
		<div className="min-h-screen">
			{/* Hero section */}
			<section className="relative h-[70vh] md:h-[80vh] flex items-center bg-gradient-to-br from-orange-100 to-orange-200">
				<div className="container mx-auto px-4">
					<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold text-orange-800">
						Freshly Squeezed Happiness,
						<br className="hidden md:block" />
						Delivered to You!
					</motion.h1>
					<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-4 max-w-2xl text-lg md:text-xl text-gray-800">
						Premium oranges, squeezed on demand. Order now and get it delivered fast.
					</motion.p>
					<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-6">
						<Link to="/juices" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium shadow">Order Now</Link>
					</motion.div>
				</div>
			</section>

			<div className="container mx-auto px-4 py-10">
				<ProductGrid products={products} onOrder={() => navigate('/juices')} />
				<Testimonials />
			</div>

			<OrderModal open={open} defaultProduct={selected} onClose={() => setOpen(false)} />
			<OrderConfirmationModal 
				isOpen={showConfirmation} 
				onClose={handleCloseConfirmation}
				orderId={orderId}
			/>
		</div>
	);
}



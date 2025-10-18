import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { setBackgroundImage } from '../utils/bg';

export default function HeroSection({ bgImage }) {
	return (
		<div className="relative overflow-hidden rounded-xl mb-8" style={bgImage ? setBackgroundImage(bgImage) : { backgroundImage:'linear-gradient(90deg,#ffedd5,#fde68a)' }}>
			<div className="px-6 py-16 md:py-24">
				<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-extrabold text-orange-700">Freshly Squeezed Happiness,<br />Delivered to You!</motion.h1>
				<p className="mt-3 text-gray-700 max-w-2xl">Premium oranges, squeezed on demand. Order now and get it delivered fast.</p>
				<div className="mt-6">
					<Link to="/juices" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">Order Now</Link>
				</div>
			</div>
		</div>
	);
}



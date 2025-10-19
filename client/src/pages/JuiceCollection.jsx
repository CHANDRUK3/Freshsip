import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import FiltersBar from '../components/FiltersBar';
import { Toaster, toast } from 'react-hot-toast';
import { API_BASE } from '../utils/api';

const categories = ['all', 'Juice', 'Premium Juices', 'Coconut Water', 'Combos'];

export default function JuiceCollection() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [sortBy, setSortBy] = useState('featured');
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		fetchProducts();
	}, [selectedCategory, sortBy, searchQuery, currentPage]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				category: selectedCategory === 'all' ? '' : selectedCategory,
				sort: sortBy,
				page: currentPage.toString(),
				limit: '12'
			});
			
			if (searchQuery) params.append('search', searchQuery);

			const response = await fetch(`${API_BASE}/api/products?${params}`);
			const data = await response.json();
			
			if (response.ok) {
				setProducts(data.products);
				setPagination(data.pagination);
			} else {
				toast.error('Failed to fetch products');
			}
		} catch (error) {
			toast.error('Error loading products');
		} finally {
			setLoading(false);
		}
	};

	const handleAddToCart = (product) => {
		toast.success(`${product.name} added to cart!`);
		// TODO: Implement cart functionality
	};

	const handleViewProduct = (product) => {
		// TODO: Navigate to product detail page
		toast.success(`Viewing ${product.name}`);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Toaster />
			
			{/* Hero Banner */}
			<section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0" style={{ backgroundImage: "url('/images/orange-juice-home.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
				<div className="absolute inset-0 bg-orange-500/30" />
				<div className="relative z-10 text-center text-white">
					{/* Hero content removed */}
				</div>
			</section>

			{/* Filters */}
			<FiltersBar
				categories={categories}
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
				sortBy={sortBy}
				onSortChange={setSortBy}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{/* Products Grid */}
			<div className="container mx-auto px-4 py-8">
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
					</div>
				) : products.length === 0 ? (
					<div className="text-center py-16">
						<div className="text-6xl mb-4">🍊</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">No juices available</h3>
						<p className="text-gray-500">No juices available in this category. Try adjusting your filters.</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products.map((product, index) => (
								<motion.div
									key={product._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<ProductCard
										product={product}
										onAddToCart={handleAddToCart}
										onViewProduct={handleViewProduct}
									/>
								</motion.div>
							))}
						</div>

						{/* Pagination */}
						{pagination.totalPages > 1 && (
							<div className="flex justify-center items-center gap-2 mt-12">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={!pagination.hasPrev}
									className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
								>
									Previous
								</button>
								
								{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`px-4 py-2 rounded-lg ${
											page === currentPage
												? 'bg-orange-500 text-white'
												: 'border border-gray-300 hover:bg-gray-50'
										}`}
									>
										{page}
									</button>
								))}
								
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={!pagination.hasNext}
									className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

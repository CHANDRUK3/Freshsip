import React from 'react';

export default function FiltersBar({ 
	categories, 
	selectedCategory, 
	onCategoryChange, 
	sortBy, 
	onSortChange, 
	searchQuery, 
	onSearchChange 
}) {
	return (
		<div className="bg-white border-b border-gray-200 sticky top-16 z-40">
			<div className="container mx-auto px-4 py-4">
				<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
					{/* Search */}
					<div className="w-full md:w-64">
						<input
							type="text"
							placeholder="Search juices..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
						/>
					</div>

					{/* Categories */}
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => onCategoryChange(category)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									selectedCategory === category
										? 'bg-orange-500 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category}
							</button>
						))}
					</div>

					{/* Sort */}
					<div className="w-full md:w-48">
						<select
							value={sortBy}
							onChange={(e) => onSortChange(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
						>
							<option value="featured">Featured</option>
							<option value="best_selling">Best Selling</option>
							<option value="alphabetical">A-Z</option>
							<option value="price_asc">Price: Low to High</option>
							<option value="price_desc">Price: High to Low</option>
							<option value="newest">Newest</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

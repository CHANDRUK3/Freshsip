import React from 'react';

export default function ProductGrid({ products, onOrder }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{products.map((p) => (
				<div key={p.id} className="bg-white border rounded-lg p-4 shadow-sm">
					<div className="mb-2 h-40 rounded-lg flex items-center justify-center overflow-hidden" style={{background:'#fff7ed'}}>
						{p.image ? (
							<img src={p.image} alt={p.name} className="h-full w-full object-cover" />
						) : (
							<span>🍊</span>
						)}
					</div>
					<h3 className="text-lg font-semibold">{p.name}</h3>
					<p className="text-gray-600 text-sm">{p.description}</p>
					<div className="flex items-center justify-between mt-3">
						<span className="font-medium">{p.price}</span>
						<button onClick={() => onOrder && onOrder(p.name)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded">Order Now</button>
					</div>
				</div>
			))}
		</div>
	);
}



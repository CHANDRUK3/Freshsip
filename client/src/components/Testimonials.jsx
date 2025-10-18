import React from 'react';

const testimonials = [
	{ id: 1, name: 'Ayesha', text: 'Best orange juice in town! Super fast delivery.' },
	{ id: 2, name: 'Rahul', text: 'So fresh and tasty. Loved the Pulp Lover variant.' },
	{ id: 3, name: 'Mina', text: 'Great experience. Ordering again soon!' },
];

export default function Testimonials() {
	return (
		<section className="mt-12">
			<h2 className="text-2xl font-bold mb-4">What our customers say</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{testimonials.map(t => (
					<div key={t.id} className="bg-white border rounded-lg p-4">
						<p className="text-gray-700">“{t.text}”</p>
						<p className="mt-2 font-medium">— {t.name}</p>
					</div>
				))}
			</div>
		</section>
	);
}



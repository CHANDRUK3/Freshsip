import React from 'react';

export default function Footer() {
	return (
		<footer className="border-t mt-12">
			<div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
				© {new Date().getFullYear()} FreshSip. All rights reserved.
			</div>
		</footer>
	);
}




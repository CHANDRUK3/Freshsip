import React, { useState } from 'react';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000';

export default function Order() {
	const [form, setForm] = useState({ name: '', email: '', product: 'Classic Orange Juice', quantity: 1, address: '' });
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: name === 'quantity' ? Number(value) : value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		try {
			const res = await fetch(`${API_BASE}/api/orders`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to place order');
			setMessage('Order placed! Track it on the Track Order page.');
			setForm({ name: '', email: '', product: 'Classic Orange Juice', quantity: 1, address: '' });
		} catch (err) {
			setMessage(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-xl">
			<h1 className="text-2xl font-bold mb-4">Place an Order</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<select name="product" value={form.product} onChange={handleChange} className="w-full border p-2 rounded">
					<option>Classic Orange Juice</option>
					<option>Pulp Lover</option>
					<option>Vitamin Boost</option>
				</select>
				<input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
				<input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
				<input type="number" min="1" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="w-full border p-2 rounded" required />
				<textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" required />
				<button disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded">
					{loading ? 'Submitting...' : 'Submit Order'}
				</button>
			</form>
			{message && <p className="mt-4">{message}</p>}
		</div>
	);
}



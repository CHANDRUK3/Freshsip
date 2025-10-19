import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setAuth } from '../utils/auth';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_BASE, apiCall } from '../utils/api';

export default function Signup() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('user');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSignup(e) {
		e.preventDefault();
		setLoading(true);
		try {
			console.log('Attempting signup with API_BASE:', API_BASE);
			const data = await apiCall('/api/auth/signup', {
				method: 'POST',
				body: JSON.stringify({ name, email, password, role })
			});
			
			setAuth(data.token, data.user);
			toast.success('Account created successfully!');
			
			if (data.user.role === 'admin') {
				navigate('/admin-dashboard');
			} else {
				navigate('/shop');
			}
		} catch (err) {
			console.error('Signup error:', err);
			toast.error(err.message || 'Failed to create account');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-screen relative" style={{ minHeight: 'calc(100vh - 120px)', marginTop: '60px', marginBottom: '60px' }}>
			{/* Full background covering navbar to footer */}
			<div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/images/orange-juice-home.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', top: '-60px', bottom: '-60px', left: 0, right: 0 }} />
			<div className="absolute inset-0 z-0 bg-orange-500/20" style={{ top: '-60px', bottom: '-60px' }} />
			
			{/* Content area with scrolling */}
			<div className="relative z-10 h-full flex items-center justify-center">
				<Toaster />
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md mx-4 bg-white/80 backdrop-blur rounded-xl p-6 shadow">
					<h1 className="text-2xl font-bold mb-4 text-orange-800">Sign Up</h1>
					<form onSubmit={handleSignup} className="space-y-4">
						<input placeholder="Name" className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-300 transition" value={name} onChange={(e)=>setName(e.target.value)} required />
						<input type="email" placeholder="Email" className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-300 transition" value={email} onChange={(e)=>setEmail(e.target.value)} required />
						<input type="password" placeholder="Password" className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-300 transition" value={password} onChange={(e)=>setPassword(e.target.value)} required />
						<select className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-300 transition" value={role} onChange={(e)=>setRole(e.target.value)}>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
						<button disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition">{loading ? 'Creating...' : 'Create account'}</button>
					</form>
					<p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-orange-700 font-medium">Login</Link></p>
				</motion.div>
			</div>
		</div>
	);
}



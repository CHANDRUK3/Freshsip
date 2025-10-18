import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../utils/auth';

export default function Navbar() {
	const navigate = useNavigate();
	const user = getUser();
	function logout() {
		clearAuth();
		navigate('/');
	}
	return (
		<nav className="bg-white border-b">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<Link to="/" className="text-xl font-bold text-orange-600">FreshSip</Link>
				<div className="flex gap-4">
					<NavLink to="/" end className={({ isActive }) => isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}>Home</NavLink>
					<NavLink to="/juices" className={({ isActive }) => isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}>Shop</NavLink>
					<NavLink to="/track" className={({ isActive }) => isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}>Track Order</NavLink>
					{user && user.role === 'admin' && (
						<NavLink to="/admin" className={({ isActive }) => isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}>Admin</NavLink>
					)}
					{user ? (
						<button onClick={logout} className="text-gray-700">Logout</button>
					) : (
						<>
							<NavLink to="/login" className={({ isActive }) => isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}>Login</NavLink>
							<NavLink to="/signup" className={({ isActive }) => isActive ? 'text-orange-600 font-medium' : 'text-gray-700'}>Signup</NavLink>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}




import React from 'react';

const TOKEN_KEY = 'freshsip_token';
const USER_KEY = 'freshsip_user';

export function setAuth(token, user) {
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
	const raw = localStorage.getItem(USER_KEY);
	try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function getRole() {
	return (getUser() && getUser().role) || null;
}

export function clearAuth() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
}

export function login(token, user) {
	setAuth(token, user);
}

export function logout() {
	clearAuth();
}

export function useAuth() {
	const [user, setUser] = React.useState(getUser());
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		const token = getToken();
		const currentUser = getUser();
		
		if (token && !currentUser) {
			// Token exists but no user data, verify token with server
			setLoading(true);
			verifyToken().finally(() => setLoading(false));
		} else {
			setUser(currentUser);
		}
	}, []);

		async function verifyToken() {
		try {
			const token = getToken();
			if (!token) return;
			
			const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
			const response = await fetch(`${API_BASE}/api/auth/profile`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
			} else {
				// Token is invalid, clear auth
				clearAuth();
				setUser(null);
			}
		} catch (error) {
			console.error('Token verification failed:', error);
			clearAuth();
			setUser(null);
		}
	}

	return { user, loading, logout, verifyToken };
}



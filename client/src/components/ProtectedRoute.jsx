import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getRole } from '../utils/auth';

export default function ProtectedRoute({ children, requireAdmin = false }) {
	const token = getToken();
	const role = getRole();
	if (!token) return <Navigate to="/login" replace />;
	if (requireAdmin && role !== 'admin') return <Navigate to="/" replace />;
	return children;
}



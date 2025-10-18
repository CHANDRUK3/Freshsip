import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Order from './pages/Order';
import OrderPage from './pages/OrderPage';
import TrackOrder from './pages/TrackOrder';
import JuiceCollection from './pages/JuiceCollection';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrderConfirmationModal from './components/OrderConfirmationModal';

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
					<Route path="/order" element={<Order />} />
					<Route path="/order/:productId" element={<OrderPage />} />
					<Route path="/track" element={<TrackOrder />} />
					<Route path="/juices" element={<JuiceCollection />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/admin-dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
					{/* Legacy route for backward compatibility */}
					<Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
				</Routes>
			</main>
			<Footer />
		</BrowserRouter>
	);
}




import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/OwnerDashboard.css';

export default function OwnerDashboard(){
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [stats, setStats] = useState({
		totalVehicles: 0,
		totalBookings: 0,
		totalEarnings: 0,
		pendingRequests: 0
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAuth();
		loadDashboardStats();
	}, []);

	const checkAuth = () => {
		try {
			const storedUser = localStorage.getItem('qr_user');
			const token = localStorage.getItem('qr_token');
			const userData = storedUser ? JSON.parse(storedUser) : null;
			
			if (!token || !userData || userData.role !== 'owner') {
				navigate('/owner/login', { replace: true });
				return;
			}
			
			setUser(userData);
		} catch {
			navigate('/owner/login', { replace: true });
		}
	};

	const loadDashboardStats = async () => {
		try {
			const token = localStorage.getItem('qr_token');
			const userData = JSON.parse(localStorage.getItem('qr_user') || '{}');
			
			if (!token || !userData.id) return;

			const response = await fetch(`http://localhost:4000/api/dashboard/owner/${userData.id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				setStats(data);
			}
		} catch (error) {
			console.error('Error loading dashboard stats:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('qr_token');
		localStorage.removeItem('qr_user');
		navigate('/');
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR'
		}).format(amount);
	};

	if (loading) {
		return (
			<div className="owner-dash">
				<div className="containeeer">
					<div className="loading">Loading dashboard...</div>
				</div>
			</div>
		);
	}

	return (
	<div className="owner-dash">
		<div className="containeeer">
			<nav className="sidebar">
				<img className="logo" src="/logo1.png" alt="QuickRent Logo" />

				<div className="user-info">
					{/* <div className="user-avatar">
						<img src={user?.profileImage || "/default-avatar.png"} alt="Profile" />
					</div> */}
					<div className="user-details">
						<h3>{user?.name || 'Vehicle Owner'}</h3>
						<p>{user?.email}</p>
					</div>
				</div>

				<div className="nav-section-title">Vehicle Management</div>
				<div className="nnav-links">
					<Link to="/owner/add-vehicle">
						<i className="fas fa-plus-circle"></i> 
						<span>Add New Vehicle</span>
					</Link>
					<Link to="/owner/view-vehicles">
						<i className="fas fa-list"></i> 
						<span>View Listed Vehicles</span>
						{stats.totalVehicles > 0 && (
							<span className="badge">{stats.totalVehicles}</span>
						)}
					</Link>
					<Link to="/owner/upload-doc">
						<i className="fas fa-file-upload"></i> 
						<span>Upload Documents</span>
					</Link>
					<Link to="/owner/maintenance">
						<i className="fas fa-tools"></i> 
						<span>Maintenance Record</span>
					</Link>
					{/* <Link to="/owner/vehiclefulldetail/:id">
						<i className="fas fa-car-side"></i> 
						<span>Vehicle Details</span>
					</Link> */}
					<Link to="/owner/vehicle-security">
						<i className="fas fa-shield-alt"></i> 
						<span>Vehicle Security</span>
					</Link>
				</div>

				<div className="nav-section-title">Bookings & Payments</div>
				<div className="nnav-links">
					<Link to="/owner/Bookingrequest">
						<i className="fas fa-envelope"></i> 
						<span>Booking Requests</span>
						{stats.pendingRequests > 0 && (
							<span className="badge pending">{stats.pendingRequests}</span>
						)}
					</Link>
					{/* <Link to="/owner/Earningsummery">
						<i className="fas fa-wallet"></i> 
						<span>Earnings Summary</span>
					</Link> */}
					<Link to="/owner/Paymenthistory">
						<i className="fas fa-chart-bar"></i> 
						<span>Payment History</span>
					</Link>
				</div>

				<div className="nav-section-title">Account & Security</div>
				<div className="nnav-links">
					{/* <Link to="/owner/Owneridver">
						<i className="fas fa-id-badge"></i> 
						<span>Identity Verification</span>
					</Link> */}
					<Link to="/owner/Ownerdetails">
						<i className="fas fa-user-circle"></i> 
						<span>Owner Details</span>
					</Link>
					<Link to="/owner/security-settings">
						<i className="fas fa-lock"></i> 
						<span>Security Settings</span>
					</Link>
					<Link to="/owner/Ologhistory">
						<i className="fas fa-history"></i> 
						<span>Login History</span>
					</Link>
				</div>
			</nav>

			<main className="main-content">
				<header>
					<div className="header-content">
						<div className="welcome-section">
							<h1>Hello, {user?.name || 'Vehicle Owner'}! 👋</h1>
							<p>Here's what's happening with your vehicles today</p>
						</div>
							{/* <button className="btn-refresh" onClick={loadDashboardStats}>
								<i className="fas fa-sync-alt"></i> Refresh
							</button> */}
							{/* <button className="btn-logout" onClick={handleLogout}>
								<i className="fas fa-sign-out-alt"></i> Logout
							</button> */}
					</div>
				</header>

				{/* Dashboard Grid */}
				<div className="dashboard-grid">
					<Link to="/owner/add-vehicle" className="card" aria-label="Add New Vehicle">
						<i className="fas fa-plus-circle"></i>
						<span>Add New Vehicle</span>
					</Link>
					<Link to="/owner/view-vehicles" className="card" aria-label="View Listed Vehicles">
						<i className="fas fa-list"></i>
						<span>View Listed Vehicles</span>
					</Link>
					<Link to="/owner/upload-doc" className="card" aria-label="Upload Vehicle Documents">
						<i className="fas fa-file-upload"></i>
						<span>Upload Documents</span>
					</Link>
					<Link to="/owner/maintenance" className="card" aria-label="Maintenance Record">
						<i className="fas fa-tools"></i>
						<span>Maintenance Record</span>
					</Link>
					{/* <Link to="/owner/vehiclefulldetail/:id" className="card" aria-label="Vehicle Details">
						<i className="fas fa-car-side"></i>
						<span>Vehicle Details</span>
					</Link> */}
					<Link to="/owner/vehicle-security" className="card" aria-label="Vehicle Security">
						<i className="fas fa-shield-alt"></i>
						<span>Vehicle Security</span>
					</Link>
					<Link to="/owner/Bookingrequest" className="card" aria-label="Booking Requests">
						<i className="fas fa-envelope"></i>
						<span>Booking Requests</span>
						{stats.pendingRequests > 0 && (
							<span className="notification-dot"></span>
						)}
					</Link>
					{/* <Link to="/owner/Earningsummery" className="card" aria-label="Earnings Summary">
						<i className="fas fa-wallet"></i>
						<span>Earnings Summary</span>
					</Link> */}
					<Link to="/owner/Paymenthistory" className="card" aria-label="Payment History">
						<i className="fas fa-chart-bar"></i>
						<span>Payment History</span>
					</Link>
					{/* <Link to="/owner/Owneridver" className="card" aria-label="Identity Verification">
						<i className="fas fa-id-badge"></i>
						<span>Identity Verification</span>
					</Link> */}
					<Link to="/owner/Ownerdetails" className="card" aria-label="Owner Details">
						<i className="fas fa-user-circle"></i>
						<span>Owner Details</span>
					</Link>
					<Link to="/owner/security-settings" className="card" aria-label="Security Settings">
						<i className="fas fa-lock"></i>
						<span>Security Settings</span>
					</Link>
					<Link to="/owner/Ologhistory" className="card" aria-label="Login History">
						<i className="fas fa-history"></i>
						<span>Login History</span>
					</Link>
					<button className="card logout-card" onClick={handleLogout} aria-label="Logout">
						<i className="fas fa-sign-out-alt"></i>
						<span>Logout</span>
					</button>
				</div>
			</main>
		</div>
	</div>
	);
}

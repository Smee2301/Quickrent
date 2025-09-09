import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RenterDashboard.css";

export default function RenterDashboard() {
  const [user, setUser] = useState({ name: "Renter" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('qr_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('qr_token');
    localStorage.removeItem('qr_user');
    navigate('/');
  };

  return (
    <div className="renter-container">
      <nav className="renter-sidebar">
        <img className="renter-logo" src="/logo1.png" alt="QuickRent Logo" />

        <div className="renter-nav-section-title">My Profile</div>
        <div className="renter-nav-links">
          <Link to="/renter/Rentidverify"><i className="fas fa-id-card"></i><span>Verify Identity</span></Link>
          {/* <Link to="/renter-documents"><i className="fas fa-file-alt"></i><span>Documents</span></Link> */}
          <Link to="/renter-details"><i className="fas fa-user"></i><span>My Details</span></Link>
          <Link to="/profile-settings"><i className="fas fa-cog"></i><span>Profile Settings</span></Link>
        </div>

        <div className="renter-nav-section-title">Vehicle Booking</div>
        <div className="renter-nav-links">
          <Link to="/renter/browse-vehicles"><i className="fas fa-car"></i><span>Browse Vehicles</span></Link>
          <Link to="/renter/my-bookings"><i className="fas fa-book"></i><span>My Bookings</span></Link>
          <Link to="/rental-history"><i className="fas fa-history"></i><span>Rental History</span></Link>
          <Link to="/saved-vehicles"><i className="fas fa-heart"></i><span>Saved Vehicles</span></Link>
        </div>

        <div className="renter-nav-section-title">Security & Help</div>
        <div className="renter-nav-links">
          {/* <Link to="/renter-security"><i className="fas fa-shield-alt"></i><span>Security</span></Link> */}
          <Link to="/support"><i className="fas fa-headset"></i><span>Support</span></Link>
          <button className="renter-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i><span>Logout</span>
          </button>
        </div>
      </nav>

            <main className="renter-main-content">
          <header className="renter-header">
            <h1 className="renter-title">Renter Dashboard</h1>
            
            <div className="renter-right">
              <span className="renter-username">Hello, {user?.name || "Renter"} 👋</span>
            </div>
          </header>

        <div className="renter-dashboard-grid">
          <Link to="/renter/Rentidverify" className="renter-card" aria-label="Verify Identity"><i className="fas fa-id-card"></i> Verify Identity</Link>
          {/* <Link to="/renter-documents" className="renter-card" aria-label="Upload Documents"><i className="fas fa-file-alt"></i> Upload Documents</Link> */}
          <Link to="/renter/browse-vehicles" className="renter-card" aria-label="Browse Vehicles"><i className="fas fa-car"></i> Browse Vehicles</Link>
          <Link to="/renter/my-bookings" className="renter-card" aria-label="My Bookings"><i className="fas fa-book"></i> My Bookings</Link>
          <Link to="/rental-history" className="renter-card" aria-label="Rental History"><i className="fas fa-history"></i> Rental History</Link>
          <Link to="/saved-vehicles" className="renter-card" aria-label="Saved Vehicles"><i className="fas fa-heart"></i> Saved Vehicles</Link>
          <Link to="/profile-settings" className="renter-card" aria-label="Profile Settings"><i className="fas fa-cog"></i> Profile Settings</Link>
          <Link to="/support" className="renter-card" aria-label="Support"><i className="fas fa-headset"></i> Get Support</Link>
          <div className="renter-card" aria-label="Logout">
            <button type="button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

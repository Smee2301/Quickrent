import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
import "../styles/RenterDashboard.css";

export default function RenterDashboard() {
  const [user, setUser] = useState({ name: "Renter" });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { socket, connected } = useSocket();

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
  
  // Listen for booking approval/rejection notifications
  useEffect(() => {
    if (!socket || !connected) return;
    
    socket.on('booking_approved', (data) => {
      console.log('Booking approved:', data);
      const newNotification = {
        id: Date.now(),
        type: 'success',
        title: data.notification.title,
        message: data.notification.message,
        timestamp: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 10000);
    });
    
    socket.on('booking_rejected', (data) => {
      console.log('Booking rejected:', data);
      const newNotification = {
        id: Date.now(),
        type: 'error',
        title: data.notification.title,
        message: data.notification.message,
        timestamp: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 10000);
    });
    
    return () => {
      socket.off('booking_approved');
      socket.off('booking_rejected');
    };
  }, [socket, connected]);
  
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('qr_token');
    localStorage.removeItem('qr_user');
    navigate('/');
  };

  return (
    <div className="renter-container">
      {/* Real-time notifications */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px'
      }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            style={{
              background: notif.type === 'success' ? '#4caf50' : '#f44336',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'slideIn 0.3s ease-out',
              cursor: 'pointer'
            }}
            onClick={() => dismissNotification(notif.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '5px' }}>
                  {notif.type === 'success' ? '🎉' : '❌'} {notif.title}
                </strong>
                <p style={{ margin: 0, fontSize: '14px' }}>{notif.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(notif.id);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  marginLeft: '10px'
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      
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

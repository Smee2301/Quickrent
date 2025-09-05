import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function redirectToRole(e) {
    const value = e.target.value;
    if (!value) return;
    
    if (value === 'owner-login.html') {
      navigate('/owner/login');
    } else if (value === 'renter-login.html') {
      navigate('/renter/login');
    }
  }

  function toggleProfile() {
    setIsProfileOpen(!isProfileOpen);
  }

  // Close profile menu when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileOpen(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Don't render header on login/signup pages
  if (location.pathname.includes('/owner/') || location.pathname.includes('/renter/')) {
    return null;
  }

  return (
    <header>
      <div className="navbar">
        <div className="nav-logo">
          <img className="logo" src="/logo1.png" alt="QuickRent Logo" />
        </div>

        <div className="nav-role-selector">
          <label htmlFor="user-role" className="role-label">Select Your Role:</label>
          <select id="user-role" onChange={redirectToRole}>
            <option value="">Select an Option</option>
            <option value="owner-login.html">Owner</option>
            <option value="renter-login.html">Renter</option>
          </select>
        </div>
      
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">How it works</Link>
          <Link to="/login">Contact us</Link>
        </nav>

        {/* User Actions */}
        <select id="language-switch" title="Choose Language">
          <option value="en">🌐 EN</option>
          <option value="hi">🇮🇳 HI</option>
          <option value="gu">🇮🇳 GU</option>
        </select>
      
        {/* <div className="profile-dropdown">
          <button className="profile-btn" onClick={toggleProfile}>
            <i className="fa-solid fa-user-plus"></i>
          </button>
          <div className={`profile-menu ${isProfileOpen ? 'show' : ''}`}>
            <Link to="/profile">
              <i className="fa-solid fa-circle-user"></i> View Profile
            </Link>
            <Link to="/change-password">
              <i className="fa-solid fa-key"></i> Change Password
            </Link>
            <Link to="/logout">
              <i className="fa-solid fa-lock"></i> Logout
            </Link>
          </div>
        </div> */}
      </div>
    </header>
  );
}



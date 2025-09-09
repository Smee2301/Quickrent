import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/RenterLogin.css";

export default function RenterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [lastEmail, setLastEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qr_last_renter_email');
      if (stored) {
        setLastEmail(stored);
        if (!email) setEmail(stored);
      }
    } catch {}
  }, []);

  

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMsg('');
    setErrors({});

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setMsg(data.message);
        }
        return;
      }

      if (data.user?.role !== 'renter') {
        setMsg('This account is not registered as a Renter. Please use the Owner login instead.');
        return;
      }

      if (data.token) {
        localStorage.setItem('qr_token', data.token);
        localStorage.setItem('qr_user', JSON.stringify(data.user));
        try { localStorage.setItem('qr_last_renter_email', email); } catch {}
      }

      setMsg('Login successful! Redirecting...\nTip: Save your email/password securely and lock your device with a PIN.');
      setTimeout(() => {
        navigate('/renter/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      setMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    // In production, this would redirect to Google OAuth
    setMsg("Google OAuth integration coming soon!");
  }

  const getFieldError = (field) => errors[field] || "";

  return (
    <div className="renter-login-page">
      <div className="renter-login-container">
        <img src="/logo1.png" alt="QuickRent Logo" className="renter-login-logo" />
        <h2>Renter Sign In</h2>
        <p>Access your rental dashboard and manage bookings</p>
        
        <form onSubmit={onSubmit}>
          <div className="renter-login-input">
            <label>Email Address *</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
              }} 
              placeholder="Enter your email address"
              className={getFieldError("email") ? "error" : ""}
              required 
            />
            {getFieldError("email") && <span className="error-text">{getFieldError("email")}</span>}
          </div>
     <br></br>     
          <div className="renter-login-inputt">
            <label>Password *</label>
            <div className="password-input">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                }} 
                placeholder="Enter your password"
                className={getFieldError("password") ? "error" : ""}
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {getFieldError("password") && <span className="error-text">{getFieldError("password")}</span>}
          </div>
            <br></br>
          <button 
            className="renter-login-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="renter-google-btn" onClick={handleGoogleLogin}>
          🔍 Sign in with Google
        </button>

        <div className="renter-login-links">
          <Link to="/forgot-passwordrent">Forgot Password?</Link>
          <span className="separator">•</span>
          <Link to="/renter/signup">Create Account</Link>
        </div>
        
        <div className="renter-login-msg">{msg}</div>
      </div>
    </div>
  );
}

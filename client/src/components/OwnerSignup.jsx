import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/OwnerSignup.css";
import "../styles/CredentialsPopup.css";

export default function OwnerSignup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but validate if provided)
    if (form.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (!form.confirm) {
      newErrors.confirm = "Please confirm your password";
    } else if (form.password !== form.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if email/phone already exists
  const checkExistingUser = async () => {
    try {
      const payload = {};
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.phone.trim()) payload.phone = form.phone.trim();
      
      if (Object.keys(payload).length === 0) return true;

      const res = await fetch("http://localhost:4000/api/auth/check-existing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          if (data.field === 'email') {
            setErrors(prev => ({ ...prev, email: "An account with this email already exists" }));
          } else if (data.field === 'phone') {
            setErrors(prev => ({ ...prev, phone: "An account with this phone number already exists" }));
          }
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("Error checking existing user:", err);
      return true; // Continue with registration if check fails
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check for existing user before proceeding
    const canProceed = await checkExistingUser();
    if (!canProceed) {
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "owner" }),
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

      setMsg("Account created successfully! You can now sign in.\nTip: Save your email/password securely and lock your device with a PIN.");
      try { localStorage.setItem('qr_last_owner_email', form.email); } catch {}
      setSavedCredentials({ email: form.email, password: form.password });
      setShowCredentials(true);
      setTimeout(() => {
        navigate("/owner/login");
      }, 2000);
    } catch (err) {
      setMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function update(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    };
  }

  function handleGoogleSignup() {
    // In production, this would redirect to Google OAuth
    setMsg("Google OAuth integration coming soon!");
  }

  const getFieldError = (field) => errors[field] || "";

  return (
    <div className="owner-signup-page">
      <div className="owner-signup-container">
        <h2>Create Owner Account</h2>
        <p className="signup-subtitle">Join QuickRent as a vehicle owner</p>
        
        <form onSubmit={onSubmit}>
          <div className="owner-form-group">
            <label>Full Name *</label>
            <input 
              type="text"
              value={form.name} 
              onChange={update("name")} 
              placeholder="Enter your full name"
              className={getFieldError("name") ? "error" : ""}
              required 
            />
            {getFieldError("name") && <span className="error-text">{getFieldError("name")}</span>}
          </div>
<br></br>
          <div className="owner-form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={update("email")} 
              placeholder="Enter your email address"
              className={getFieldError("email") ? "error" : ""}
              required 
            />
            {getFieldError("email") && <span className="error-text">{getFieldError("email")}</span>}
          </div>
<br></br>
          <div className="owner-form-group">
            <label>Phone Number (Optional)</label>
            <input 
              type="tel" 
              value={form.phone} 
              onChange={update("phone")} 
              placeholder="Enter your phone number"
              className={getFieldError("phone") ? "error" : ""}
            />
            {getFieldError("phone") && <span className="error-text">{getFieldError("phone")}</span>}
          </div>
<br></br>
          <div className="owner-form-group">
            <label>Password *</label>
            <div className="password-input">
              <input 
                type={showPassword ? "text" : "password"} 
                value={form.password} 
                onChange={update("password")} 
                placeholder="Create a password (min 6 characters)"
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
          <div className="owner-form-group">
            <label>Confirm Password *</label>
            <div className="password-input">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={form.confirm} 
                onChange={update("confirm")} 
                placeholder="Confirm your password"
                className={getFieldError("confirm") ? "error" : ""}
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {getFieldError("confirm") && <span className="error-text">{getFieldError("confirm")}</span>}
          </div>
<br></br>
          <button 
            className="owner-signup-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="owner-google-btn" onClick={handleGoogleSignup}>
          🔍 Sign up with Google
        </button>

        <div className="owner-signup-link">
          <span>Already have an account? </span>
          <Link to="/owner/login">Sign in</Link>
        </div>

        <div className="owner-signup-msg">{msg}</div>
        
        {/* Credentials Popup */}
        {showCredentials && (
          <div className="credentials-popup">
            <div className="credentials-content">
              <h4>Your Login Details</h4>
              <div className="credential-item">
                <strong>Email:</strong> {savedCredentials.email}
              </div>
              <div className="credential-item">
                <strong>Password:</strong> {savedCredentials.password}
              </div>
              <button 
                className="close-popup-btn"
                onClick={() => setShowCredentials(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

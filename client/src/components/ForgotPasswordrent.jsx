import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [contactType, setContactType] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);

  const validateContact = () => {
    if (contactType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(contactValue);
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(contactValue);
    }
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  async function checkAccount() {
    if (!validateContact()) {
      setMsg(`Please enter a valid ${contactType}`);
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const payload = contactType === "email" ? { email: contactValue } : { phone: contactValue };
      const res = await fetch("http://localhost:4000/api/auth/check-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      setAccountInfo(data.accountInfo);
      setMsg(`Account found! ${data.accountInfo.name} (${data.accountInfo.role})`);
    } catch (err) {
      setMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOtp() {
    if (!validateContact()) {
      setMsg(`Please enter a valid ${contactType}`);
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const payload = contactType === "email" ? { email: contactValue } : { phone: contactValue };
      const res = await fetch("http://localhost:4000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      setOtpSent(true);
      setMsg(`OTP sent to your ${contactType}! Check console for development OTP.`);
    } catch (err) {
      setMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword() {
    if (!validatePassword(newPass)) {
      setMsg("Password must be at least 6 characters long");
      return;
    }

    if (newPass !== confirmPass) {
      setMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const payload = {
        [contactType]: contactValue,
        otp,
        newPass,
      };

      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      setMsg("Password reset successful! You can now sign in with your new password.");
      setOtpSent(false);
      setOtp("");
      setNewPass("");
      setConfirmPass("");
      setAccountInfo(null);
    } catch (err) {
      setMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setContactType("email");
    setContactValue("");
    setOtpSent(false);
    setOtp("");
    setNewPass("");
    setConfirmPass("");
    setMsg("");
    setAccountInfo(null);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h2>Forgot Password</h2>
        
        {!otpSent ? (
          <>
            <p>Enter your registered email or phone number to reset your password</p>
            
            <div className="contact-type-selector">
              <label>
                <input
                  type="radio"
                  name="contactType"
                  value="email"
                  checked={contactType === "email"}
                  onChange={(e) => setContactType(e.target.value)}
                />
                Email
              </label>
              <label>
                <input
                  type="radio"
                  name="contactType"
                  value="phone"
                  checked={contactType === "phone"}
                  onChange={(e) => setContactType(e.target.value)}
                />
                Phone
              </label>
            </div>

            <input
              type={contactType === "email" ? "email" : "tel"}
              placeholder={`Enter your ${contactType}`}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              required
            />

            <div className="button-group">
              <button 
                className="forgot-btn secondary" 
                onClick={checkAccount}
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Check Account"}
              </button>
              <button 
                className="forgot-btn primary" 
                onClick={sendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>

            {accountInfo && (
              <div className="account-info">
                <p>Account found: {accountInfo.name} ({accountInfo.role})</p>
                <p>Contact: {accountInfo.contactValue}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <p>Enter the OTP sent to your {contactType} and create a new password</p>
            
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
            
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />

            <div className="button-group">
              <button 
                className="forgot-btn secondary" 
                onClick={() => setOtpSent(false)}
                disabled={isLoading}
              >
                Back
              </button>
              <button 
                className="forgot-btn primary" 
                onClick={resetPassword}
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}

        <div className="forgot-msg">{msg}</div>
        
        <div className="forgot-links">
          <Link to="/renter/login">Back to Renter Login</Link>
          <button className="reset-link" onClick={resetForm}>Start Over</button>
        </div>
      </div>
    </div>
  );
}

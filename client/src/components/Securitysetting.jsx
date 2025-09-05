import React, { useState } from "react";
import "../styles/Securitysetting.css";

export default function Securitysetting() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handle2FA = () => {
    if (twoFAEnabled) {
      setStatusText("Two-Factor Authentication is ENABLED.");
    } else {
      setStatusText("Two-Factor Authentication is DISABLED.");
    }
  };

  return (
    <div className="Secu">
      {/* Navbar */}
      <div className="owner-sec-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h1>QuickRent - Security Settings</h1>
      </div>

      {/* Security Settings Container */}
      <div className="owner-sec-container">
        <h2>
          <i className="fas fa-shield-alt"></i> Security Settings
        </h2>

        {/* Change Password */}
        <div className="sec-card">
          <div className="sec-icon orange">
            <i className="fas fa-key"></i>
          </div>
          <div className="sec-card-content">
            <h3>Change Password</h3>
            <p>
              Update your account password regularly to keep your account safe.
            </p>
            <input
              type="password"
              id="sec-password"
              placeholder="Enter new password"
              className="password-input"
            />
             <br></br>
            <button
              className="sec-btn"
              onClick={() => alert("Password changed successfully!")}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="sec-card">
          <div className="sec-icon green">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="sec-card-content">
            <h3>Two-Factor Authentication (2FA)</h3>
            <p>Enable 2FA for an extra layer of security on your account.</p>
            <div className="toggle-container">
              <label>
              <br></br>
                <input
                  type="checkbox"
                  checked={twoFAEnabled}
                  onChange={(e) => setTwoFAEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <br></br>
              <span>{twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}</span>
            </div>
            <br></br>
            <button className="sec-btn" onClick={handle2FA}>
              Apply
            </button>
            <p className="status-text">{statusText}</p>
          </div>
        </div>

        {/* Session Management */}
        <div className="sec-card">
          <div className="sec-icon blue">
            <i className="fas fa-users"></i>
          </div>
          <div className="sec-card-content">
            <h3>Session Management</h3>
            <p>View and logout from devices where your account is currently active.</p>
            <button
              className="sec-btn"
              onClick={() => alert("All sessions logged out!")}
            >
              Logout from all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

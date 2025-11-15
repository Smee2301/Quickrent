import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SecuritySettings.css';

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState('password');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState('sms'); // 'sms', 'email', 'app'
  const [sessions, setSessions] = useState([
    { 
      id: 1, 
      device: 'Chrome on Windows 11', 
      location: 'Mumbai, Maharashtra, India', 
      lastActive: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }), 
      current: true,
      ipAddress: '192.168.1.105'
    },
    { 
      id: 2, 
      device: 'Safari on iPhone 15 Pro', 
      location: 'Delhi, Delhi, India', 
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }), 
      current: false,
      ipAddress: '103.21.244.22'
    },
    { 
      id: 3, 
      device: 'Firefox on macOS Sonoma', 
      location: 'Bangalore, Karnataka, India', 
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }), 
      current: false,
      ipAddress: '157.240.241.35'
    },
    { 
      id: 4, 
      device: 'Edge on Android', 
      location: 'Chennai, Tamil Nadu, India', 
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }), 
      current: false,
      ipAddress: '172.217.160.78'
    }
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('qr_token');
        const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
        
        if (user.phone) {
          setMobileNumber(user.phone);
          // If user already has a phone number, they might already have 2FA enabled
          if (user.twoFactorEnabled) {
            setTwoFactorEnabled(true);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      length: password.length >= minLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      numbers: hasNumbers,
      specialChar: hasSpecialChar,
      allValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!passwordForm.currentPassword) {
      setMessage('❌ Please enter your current password');
      setLoading(false);
      return;
    }

    if (!passwordForm.newPassword) {
      setMessage('❌ Please enter a new password');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('❌ New passwords do not match');
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (!passwordValidation.allValid) {
      setMessage('❌ New password does not meet security requirements');
      setLoading(false);
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setMessage('❌ New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');

      const response = await fetch(`http://localhost:4000/api/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Password changed successfully! You have been logged out from all other devices for security.');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Simulate logging out from all other sessions
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.current ? session : { ...session, lastActive: 'Session ended' }
          )
        );
      } else {
        setMessage(`❌ ${data.message || 'Failed to change password. Please check your current password.'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!mobileNumber) {
      setMessage('❌ Please enter your mobile number first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');

      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: mobileNumber,
          userId: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setMessage(`✅ OTP sent successfully to ${mobileNumber}. Please check your SMS.`);
      } else {
        setMessage(`❌ ${data.message || 'Failed to send OTP'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode) {
      setMessage('❌ Please enter the OTP code');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');

      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: mobileNumber,
          otp: otpCode,
          userId: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTwoFactorEnabled(true);
        setOtpSent(false);
        setOtpCode('');
        setMessage('✅ Two-factor authentication is now ON! Your account is more secure with SMS verification.');
      } else {
        setMessage(`❌ ${data.message || 'Invalid OTP. Please try again.'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTwoFactorEnabled(false);
        setMessage('⚠️ Two-factor authentication is now OFF. Your account security has been reduced. We recommend keeping it enabled.');
      } catch (error) {
        setMessage('❌ Failed to update two-factor authentication. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Enable 2FA - need to verify mobile number first
      if (!mobileNumber) {
        setMessage('❌ Please enter your mobile number to enable two-factor authentication');
        return;
      }
      await sendOTP();
    }
  };

  const handleSessionRevoke = async (sessionId) => {
    if (confirm('Are you sure you want to revoke this session? The user will be logged out from this device.')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setSessions(sessions.filter(session => session.id !== sessionId));
        setMessage('✅ Session revoked successfully! The user has been logged out from that device.');
      } catch (error) {
        setMessage('❌ Failed to revoke session. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogoutAllDevices = async () => {
    if (confirm('Are you sure you want to logout from ALL devices? You will need to login again on all devices.')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.current ? session : { ...session, lastActive: 'Logged out' }
          )
        );
        setMessage('✅ Successfully logged out from all other devices! Only your current session remains active.');
      } catch (error) {
        setMessage('❌ Failed to logout from all devices. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const passwordValidation = validatePassword(passwordForm.newPassword);

  return (
    <div className="security-settings-page">
      <div className="security-header">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h1>Security Settings</h1>
      </div>

      <div className="security-container">
        <button
          type="button"
          onClick={() => navigate('/owner/dashboard')}
          className="back-SS-btn"
          aria-label="Back to Owner Dashboard"
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <div className="security-tabs">
          <button 
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fas fa-key"></i> Change Password
          </button>
          <button 
            className={`tab ${activeTab === 'twofactor' ? 'active' : ''}`}
            onClick={() => setActiveTab('twofactor')}
          >
            <i className="fas fa-shield-alt"></i> Two-Factor Authentication
          </button>
          <button 
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <i className="fas fa-desktop"></i> Session Management
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="security-content">
          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="password-section">
              <h2>Change Password</h2>
              <p>Update your password to keep your account secure</p>
              
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password *</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    required
                  />
                  
                  {/* Password Requirements */}
                  {passwordForm.newPassword && (
                    <div className="password-requirements">
                      <h4>Password Requirements:</h4>
                      <div className={`requirement ${passwordValidation.length ? 'valid' : 'invalid'}`}>
                        <i className={`fas ${passwordValidation.length ? 'fa-check' : 'fa-times'}`}></i>
                        At least 8 characters
                      </div>
                      <div className={`requirement ${passwordValidation.upperCase ? 'valid' : 'invalid'}`}>
                        <i className={`fas ${passwordValidation.upperCase ? 'fa-check' : 'fa-times'}`}></i>
                        One uppercase letter
                      </div>
                      <div className={`requirement ${passwordValidation.lowerCase ? 'valid' : 'invalid'}`}>
                        <i className={`fas ${passwordValidation.lowerCase ? 'fa-check' : 'fa-times'}`}></i>
                        One lowercase letter
                      </div>
                      <div className={`requirement ${passwordValidation.numbers ? 'valid' : 'invalid'}`}>
                        <i className={`fas ${passwordValidation.numbers ? 'fa-check' : 'fa-times'}`}></i>
                        One number
                      </div>
                      <div className={`requirement ${passwordValidation.specialChar ? 'valid' : 'invalid'}`}>
                        <i className={`fas ${passwordValidation.specialChar ? 'fa-check' : 'fa-times'}`}></i>
                        One special character
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-change-password"
                  disabled={loading || !passwordValidation.allValid || passwordForm.newPassword !== passwordForm.confirmPassword}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Two-Factor Authentication Tab */}
          {activeTab === 'twofactor' && (
            <div className="twofactor-section">
              <h2>Two-Factor Authentication</h2>
              <p>Add an extra layer of security to your account</p>
              
              <div className="twofactor-card">
                <div className="twofactor-status">
                  <div className="status-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Protect your account with an additional security step</p>
                  </div>
                  <div className="status-toggle">
                    <span className={`status-text ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button 
                      className={`toggle-btn ${twoFactorEnabled ? 'active' : ''}`}
                      onClick={handleTwoFactorToggle}
                      disabled={loading}
                    >
                      <div className="toggle-slider"></div>
                    </button>
                  </div>
                </div>

                {/* Mobile Number Setup */}
                {!twoFactorEnabled && (
                  <div className="mobile-setup">
                    <h4>Setup Mobile Number for SMS Verification</h4>
                    {mobileNumber && (
                      <div className="current-phone-info">
                        <p><strong>Current registered phone:</strong> {mobileNumber}</p>
                        <p className="info-text">You can use this number or update it below</p>
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="mobileNumber">Mobile Number *</label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter your mobile number (e.g., +91 9876543210)"
                        required
                      />
                    </div>
                    <button 
                      className="btn-send-otp"
                      onClick={sendOTP}
                      disabled={loading || !mobileNumber}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                )}

                {/* OTP Verification */}
                {otpSent && !twoFactorEnabled && (
                  <div className="otp-verification">
                    <h4>Verify OTP</h4>
                    <p>Enter the 6-digit code sent to {mobileNumber}</p>
                    <div className="form-group">
                      <label htmlFor="otpCode">OTP Code *</label>
                      <input
                        type="text"
                        id="otpCode"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        required
                      />
                    </div>
                    <div className="otp-actions">
                      <button 
                        className="btn-verify-otp"
                        onClick={verifyOTP}
                        disabled={loading || !otpCode}
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button 
                        className="btn-resend-otp"
                        onClick={sendOTP}
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}
                
                {twoFactorEnabled && (
                  <div className="twofactor-info">
                    <div className="info-item">
                      <i className="fas fa-sms"></i>
                      <div>
                        <strong>SMS Verification</strong>
                        <p>Verified mobile: {mobileNumber}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-mobile-alt"></i>
                      <div>
                        <strong>Authenticator App</strong>
                        <p>Use Google Authenticator or similar app (Coming Soon)</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <strong>Email Verification</strong>
                        <p>Receive codes via email (Coming Soon)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session Management Tab */}
          {activeTab === 'sessions' && (
            <div className="sessions-section">
              <h2>Session Management</h2>
              <p>Manage your active sessions across different devices</p>
              
              <div className="sessions-actions">
                <button 
                  className="btn-logout-all"
                  onClick={handleLogoutAllDevices}
                  disabled={loading}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout from All Other Devices
                </button>
              </div>

              <div className="sessions-list">
                {sessions.map((session) => (
                  <div key={session.id} className={`session-item ${session.current ? 'current' : ''}`}>
                    <div className="session-info">
                      <div className="session-device">
                        <i className="fas fa-desktop"></i>
                        <div>
                          <h4>{session.device}</h4>
                          <p>{session.location}</p>
                        </div>
                      </div>
                      <div className="session-details">
                        <span className="last-active">Last active: {session.lastActive}</span>
                        <span className="ip-address">IP: {session.ipAddress}</span>
                        {session.current && <span className="current-session">Current Session</span>}
                      </div>
                    </div>
                    <div className="session-actions">
                      {!session.current && (
                        <button 
                          className="btn-revoke"
                          onClick={() => handleSessionRevoke(session.id)}
                          disabled={loading}
                        >
                          <i className="fas fa-times"></i> Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="session-info-card">
                <h4><i className="fas fa-info-circle"></i> Session Information</h4>
                <ul>
                  <li>Sessions are automatically managed and will expire after 30 days of inactivity</li>
                  <li>You can revoke any session except your current one</li>
                  <li>Changing your password will revoke all other sessions</li>
                  <li>If you notice suspicious activity, revoke all sessions immediately</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

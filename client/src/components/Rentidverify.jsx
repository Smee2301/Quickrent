import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rentidverify.css";
import "../styles/SharedButtons.css";

export default function Rentidverify() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    drivingLicense: null,
    addressProof: null
  });
  const [previews, setPreviews] = useState({ drivingLicense: '', addressProof: '' });
  // KYC state (Aadhaar/PAN + Mobile OTP)
  const [idType, setIdType] = useState('aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [kycVerified, setKycVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
      if (user?.phone) setMobileNumber(user.phone);
      if (user?.name) setFormData(prev => ({ ...prev, fullName: user.name }));
      if (user?.email) setFormData(prev => ({ ...prev, email: user.email }));
    } catch {}
  }, []);

  // Move to next step
  const nextStep = () => setStep(step + 1);
  
  // Move to dashboard after complete
  const goDashboard = () => {
    navigate("/renter/dashboard");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Validate and preview selected files for step 2
  const handleFileSelect = (field) => (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    if (!allowed.includes(file.type)) {
      setMessage('❌ Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setMessage('❌ File size too large. Maximum size is 5MB.');
      e.target.value = '';
      return;
    }
    setFormData(prev => ({ ...prev, [field]: file }));
    const url = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [field]: url }));
  };

  const openPreview = (field) => {
    const url = previews[field];
    if (url) {
      window.open(url, '_blank');
      // optional revoke later
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  };

  async function sendOTP() {
    if (!mobileNumber) {
      setMessage('❌ Please enter your registered mobile number');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
      const res = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: mobileNumber, userId: user.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setOtpSent(true);
      setMessage(`✅ OTP sent to ${mobileNumber}`);
    } catch (e) {
      setMessage('❌ ' + (e.message || 'Failed to send OTP'));
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOTP() {
    // Validate ID + DOB first
    if (!idNumber) { setMessage('❌ Please enter your Aadhaar/PAN number'); return; }
    if (!dob) { setMessage('❌ Please enter your Date of Birth'); return; }
    if (idType === 'aadhaar') {
      const ok = /^[0-9]{12}$/.test(idNumber.replace(/\s+/g, ''));
      if (!ok) { setMessage('❌ Invalid Aadhaar number (12 digits)'); return; }
    } else {
      const ok = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(idNumber.trim().toUpperCase());
      if (!ok) { setMessage('❌ Invalid PAN format (e.g., ABCDE1234F)'); return; }
    }
    if (!otpCode) { setMessage('❌ Please enter the OTP'); return; }

    setIsLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
      const res = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: mobileNumber, otp: otpCode, userId: user.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');

      // Age check >= 18
      const birth = new Date(dob);
      const now = new Date();
      const age = now.getFullYear() - birth.getFullYear() - ((now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) ? 1 : 0);
      if (isNaN(age)) throw new Error('Invalid Date of Birth');
      if (age < 18) {
        setKycVerified(false);
        setMessage('❌ You must be at least 18 years old to proceed.');
      } else {
        setKycVerified(true);
        setMessage('✅ KYC verified. You can continue.');
      }
    } catch (e) {
      setMessage('❌ ' + (e.message || 'Failed to verify OTP'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ridverify-body">
      {/* Navbar */}
      <div className="ridverify-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" />
        <h1>
          {step === 1
            ? "Verify Identity"
            : step === 2
            ? "Upload Documents"
            : "Verification Complete"}
        </h1>
      </div>

      {/* Stepper */}
      <div className="ridverify-stepper">
        <div className={`ridverify-step ${step >= 1 ? "active" : ""}`}>
          <div className="ridverify-step-circle">1</div>
          <p>Verify Identity</p>
        </div>
        <div className={`ridverify-step ${step >= 2 ? "active" : ""}`}>
          <div className="ridverify-step-circle">2</div>
          <p>Upload Documents</p>
        </div>
        <div className={`ridverify-step ${step >= 3 ? "active" : ""}`}>
          <div className="ridverify-step-circle">3</div>
          <p>Complete</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="ridverify-container">
        <button 
          type="button" 
          onClick={goDashboard}
          className="back-to-dashboard-btn"
          aria-label="Back to Renter Dashboard"
          style={{marginBottom: '20px'}}
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        
        {step === 1 && (
          <>
            <h2>
              <i className="fas fa-user"></i> Renter Personal Details
            </h2>
            <div className="ridverify-note">
              Please enter your personal details. You will upload the required
              documents in the next step.
            </div>
            {/* KYC (Aadhaar/PAN + Mobile OTP) */}
            <div className="ridverify-group">
              <label>
                ID Type <span className="required">*</span>
              </label>
              <select value={idType} onChange={(e) => setIdType(e.target.value)} disabled={kycVerified}>
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN</option>
              </select>
            </div>
            <div className="ridverify-group">
              <label>
                {idType === 'aadhaar' ? 'Aadhaar Number' : 'PAN Number'} <span className="required">*</span>
              </label>
              <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder={idType === 'aadhaar' ? '12-digit Aadhaar' : 'ABCDE1234F'} disabled={kycVerified} />
            </div>
            <div className="ridverify-group">
              <label>
                Date of Birth <span className="required">*</span>
              </label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={kycVerified} />
            </div>
            <div className="ridverify-group">
              <label>
                Registered Mobile Number <span className="required">*</span>
              </label>
              <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="e.g., +91 9876543210" disabled={kycVerified} />
            </div>
            {!otpSent && (
              <div className="ridverify-actions">
                <button type="button" onClick={sendOTP} disabled={isLoading || !mobileNumber}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            )}
            {otpSent && !kycVerified && (
              <div className="ridverify-group">
                <label>Enter OTP <span className="required">*</span></label>
                <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength={6} placeholder="6-digit OTP" />
                <div className="ridverify-actions" style={{ marginTop: 10 }}>
                  <button type="button" onClick={verifyOTP} disabled={isLoading || !otpCode}>{isLoading ? 'Verifying...' : 'Verify OTP'}</button>
                  <button type="button" onClick={sendOTP} disabled={isLoading} style={{ marginLeft: 8 }}>Resend OTP</button>
                </div>
              </div>
            )}
            {message && (
              <div className="ridverify-note" style={{ marginTop: 10 }}>{message}</div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!kycVerified) {
                  setMessage('❌ Please complete KYC verification before continuing.');
                  return;
                }
                nextStep();
              }}
            >
              <div className="ridverify-group">
                <label>
                  Full Name <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="ridverify-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="ridverify-actions">
                <button type="submit">Continue</button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>
              <i className="fas fa-file-upload"></i> Upload Required Documents
            </h2>
            <p className="ridverify-subtext">
              Please upload the following supporting documents for verification.
            </p>
            <br></br>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                nextStep();
              }}
            >
              <div className="ridverify-group">
                <label>
                  Driving License <span className="required">*</span>
                </label>
                <input
                  type="file"
                  name="drivingLicense"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect('drivingLicense')}
                  required
                />
                {formData.drivingLicense && (
                  <button type="button" className="ridverify-view-btn" onClick={() => openPreview('drivingLicense')}>
                    <i className="fas fa-eye"></i> View Selected
                  </button>
                )}
              </div>
              <div className="ridverify-group">
                <label>
                  Address Proof <span className="required">*</span>
                </label>
                <input
                  type="file"
                  name="addressProof"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect('addressProof')}
                  required
                />
                {formData.addressProof && (
                  <button type="button" className="ridverify-view-btn" onClick={() => openPreview('addressProof')}>
                    <i className="fas fa-eye"></i> View Selected
                  </button>
                )}
              </div>
              <div className="ridverify-actions">
                <button type="submit">Continue</button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="ridverify-check">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Verification Successful!</h2>
            <p className="ridverify-subtext">
              Your identity has been verified successfully. You can now browse
              and rent vehicles securely on QuickRent.
            </p>
            <div className="ridverify-actions">
              <button onClick={goDashboard}>Go to Dashboard</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

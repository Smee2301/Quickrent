import React, { useEffect, useState } from "react";
import "../styles/Owneridver.css";

export default function Owneridver() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaarUrl, setAadhaarUrl] = useState("");
  const [licenseUrl, setLicenseUrl] = useState("");
  const [passportUrl, setPassportUrl] = useState("");
  const [addressUrl, setAddressUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("qr_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.name) setName(user.name);
        if (user?.email) setEmail(user.email);
      }
    } catch {}
  }, []);
  
  function handleFilePreview(inputId, setUrl) {
    return (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) { setUrl(""); return; }
      const url = URL.createObjectURL(file);
      setUrl(url);
    };
  }

  function viewUrl(url) {
    if (!url) return;
    window.open(url, '_blank');
  }

  function onSubmit(e) {
    e.preventDefault();
    setSubmitMsg("✅ Documents submitted successfully for verification.");
  }
  return (
    <div className="iv-wrapper">
      {/* Navbar */}
      <div className="ivnavbarr">
        <img src="/logo1.png" alt="QuickRent Logo" className="iv-logo" />
        <h1>Identity Verification</h1>
      </div>

      {/* Container */}
      <div className="ivcontainer">
        <h2>Verify Your Identity</h2>
        <form onSubmit={onSubmit}>
          <div className="iv-form-group">
            <label htmlFor="fullname">
              Full Name <span style={{ color: "red" }}>*</span>
            </label>
            <input type="text" id="fullname" name="fullname" value={name} readOnly required />
          </div>

          <div className="iv-form-group">
            <label htmlFor="email">
              Email Address <span style={{ color: "red" }}>*</span>
            </label>
            <input type="email" id="email" name="email" value={email} readOnly required />
          </div>

          <div className="iv-form-group">
            <label htmlFor="dob">
              Date of Birth <span style={{ color: "red" }}>*</span>
            </label>
            <input type="date" id="dob" name="dob" required />
          </div>

          <div className="iv-form-group">
            <label htmlFor="aadhaar">
              Upload Aadhaar Card <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              id="aadhaar"
              name="aadhaar"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={handleFilePreview('aadhaar', setAadhaarUrl)}
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
            <button type="button" onClick={() => viewUrl(aadhaarUrl)} disabled={!aadhaarUrl}>View</button>
          </div>

          <div className="iv-form-group">
            <label htmlFor="license">
              Upload Driving License <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              id="license"
              name="license"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={handleFilePreview('license', setLicenseUrl)}
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
            <button type="button" onClick={() => viewUrl(licenseUrl)} disabled={!licenseUrl}>View</button>
          </div>

          <div className="iv-form-group">
            <label htmlFor="passport">
              Upload Passport <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              id="passport"
              name="passport"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={handleFilePreview('passport', setPassportUrl)}
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
            <button type="button" onClick={() => viewUrl(passportUrl)} disabled={!passportUrl}>View</button>
          </div>

          <div className="iv-form-group">
            <label htmlFor="addressproof">
              Upload Address Proof (Utility Bill){" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              id="addressproof"
              name="addressproof"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={handleFilePreview('addressproof', setAddressUrl)}
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
            <button type="button" onClick={() => viewUrl(addressUrl)} disabled={!addressUrl}>View</button>
          </div>

          <div className="iv-form-group">
            <label htmlFor="photo">
              Upload Recent Passport Size Photo{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept=".jpg,.jpeg,.png"
              required
              onChange={handleFilePreview('photo', setPhotoUrl)}
            />
            <p className="iv-format-note">Accepted formats: JPG, PNG</p>
            <button type="button" onClick={() => viewUrl(photoUrl)} disabled={!photoUrl}>View</button>
          </div>

          <button type="submit" className="iv-submit-btn">
            Submit for Verification
          </button>
          {submitMsg && (
            <p style={{ marginTop: "10px", color: "#16a34a", fontWeight: 600 }}>{submitMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}

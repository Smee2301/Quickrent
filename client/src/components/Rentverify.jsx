import React from "react";
import "../styles/Rentverify.css";

export default function Rentverify() {
  return (
    <div className="Rentver">
      {/* Navbar */}
      <div className="iv-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="iv-logo" />
        <h1>Identity Verification</h1>
      </div>

      {/* Container */}
      <div className="iv-container">
        <h2>Verify Your Identity</h2>
        <form>
          <div className="iv-form-group">
            <label htmlFor="fullname">
              Full Name <span className="iv-required">*</span>
            </label>
            <input type="text" id="fullname" name="fullname" required />
          </div>

          <div className="iv-form-group">
            <label htmlFor="email">
              Email Address <span className="iv-required">*</span>
            </label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="iv-form-group">
            <label htmlFor="dob">
              Date of Birth <span className="iv-required">*</span>
            </label>
            <input type="date" id="dob" name="dob" required />
          </div>

          <div className="iv-form-group">
            <label htmlFor="aadhaar">
              Upload Aadhaar Card <span className="iv-required">*</span>
            </label>
            <input
              type="file"
              id="aadhaar"
              name="aadhaar"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
          </div>

          <div className="iv-form-group">
            <label htmlFor="license">
              Upload Driving License <span className="iv-required">*</span>
            </label>
            <input
              type="file"
              id="license"
              name="license"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
          </div>

          <div className="iv-form-group">
            <label htmlFor="passport">
              Upload Passport <span className="iv-required">*</span>
            </label>
            <input
              type="file"
              id="passport"
              name="passport"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
          </div>

          <div className="iv-form-group">
            <label htmlFor="addressproof">
              Upload Address Proof (Utility Bill){" "}
              <span className="iv-required">*</span>
            </label>
            <input
              type="file"
              id="addressproof"
              name="addressproof"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <p className="iv-format-note">Accepted formats: PDF, JPG, PNG</p>
          </div>

          <div className="iv-form-group">
            <label htmlFor="photo">
              Upload Recent Passport Size Photo{" "}
              <span className="iv-required">*</span>
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept=".jpg,.jpeg,.png"
              required
            />
            <p className="iv-format-note">Accepted formats: JPG, PNG</p>
          </div>

          <button type="submit" className="iv-submit-btn">
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
}

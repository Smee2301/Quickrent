import React, { useState, useEffect } from "react";
import "../styles/Rentprofset.css";

export default function Rentprofset() {
  const [profilePic, setProfilePic] = useState("default-profile.png");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    fullAddress: "",
    city: "",
    pincode: ""
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load user data from localStorage (from login)
  useEffect(() => {
    const userData = localStorage.getItem('qr_user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        fullName: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || ""
      }));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    // Save profile data to localStorage
    localStorage.setItem('profileData', JSON.stringify(formData));
    localStorage.setItem('profilePic', profilePic);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="rps-page">
      {/* Navbar */}
      <div className="rps-navbar">
        <img src="logo1.png" alt="QuickRent Logo" className="rps-logo" />
        <h1>QuickRent – Profile Settings</h1>
      </div>
      

      {/* Profile Content */}
      <div className="rps-container">
        {/* Sidebar */}
        <div className="rps-sidebar">
          <img src={profilePic} alt="Profile" className="rps-profile-pic" />
          <input
            type="file"
            id="rpsProfileUpload"
            accept="image/*"
            onChange={handleImageChange}
          />
          <br></br>
          <label htmlFor="rpsProfileUpload" className="rps-upload">
            <i className="fas fa-camera"></i> Upload photo
          </label>
        </div>

        {/* Main Profile Forms */}
        <div className="rps-main">
          {/* Personal Info */}
          <div className="rps-card">
            <h2>
              <i className="fas fa-user"></i> Personal Information
            </h2>
            <div className="rps-grid">
              <div className="rps-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  readOnly
                  className="rps-readonly"
                />
              </div>
              <div className="rps-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  readOnly
                  className="rps-readonly"
                />
              </div>
              <div className="rps-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone || "No phone number provided"}
                  readOnly
                  className="rps-readonly"
                />
              </div>
              <div className="rps-group">
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="rps-group">
                <label>Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rps-card">
            <h2>
              <i className="fas fa-map-marker-alt"></i> Address
            </h2>
            <div className="rps-grid">
              <div className="rps-group rps-fullwidth">
                <label>Full Address</label>
                <textarea 
                  rows="3" 
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="House No, Street, City, State"
                ></textarea>
              </div>
              <div className="rps-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city" 
                />
              </div>
              <div className="rps-group">
                <label>Pincode</label>
                <input 
                  type="text" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode" 
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="rps-save">
            <button className="rps-btn" onClick={handleSaveDetails}>Save details</button>
            {showSuccessMessage && (
              <div className="rps-success-message">
                <i className="fas fa-check-circle"></i>
                Vehicle details saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

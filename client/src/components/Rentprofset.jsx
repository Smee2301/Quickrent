import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rentprofset.css";
import "../styles/SharedButtons.css";

export default function Rentprofset() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("/logo1.png");
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from API
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
      
      if (!token || !user.id) {
        navigate('/renter/login', { replace: true });
        return;
      }
      
      // First, use localStorage data
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: "",
        gender: "",
        fullAddress: "",
        city: user.city || "",
        pincode: ""
      });
      
      // Then try to fetch from API
      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const apiData = await response.json();
        console.log('API Response:', apiData);
        console.log('API profileImage:', apiData.profileImage);
        
        setFormData({
          fullName: apiData.name || "",
          email: apiData.email || "",
          phone: apiData.phone || "",
          dateOfBirth: apiData.dateOfBirth ? new Date(apiData.dateOfBirth).toISOString().split('T')[0] : "",
          gender: apiData.gender || "",
          fullAddress: apiData.address || "",
          city: apiData.city || "",
          pincode: apiData.pincode || ""
        });
        
        // Set profile image if exists
        if (apiData.profileImage) {
          const imageUrl = `http://localhost:4000/uploads/${apiData.profileImage}`;
          setProfilePic(imageUrl);
          console.log('Loading profile image:', imageUrl);
        } else {
          console.log('No profile image found in user data');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("❌ Invalid file type. Only JPG, JPEG, and PNG files are allowed.");
        e.target.value = "";
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("❌ File size too large. Maximum size is 5MB.");
        e.target.value = "";
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setShowSuccessMessage(false);
    
    try {
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
      
      if (!token || !user.id) {
        setErrorMessage("❌ Please login to update profile");
        return;
      }
      
      const data = new FormData();
      
      // Map form fields to API fields
      const apiData = {
        name: formData.fullName,
        city: formData.city,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.fullAddress,
        pincode: formData.pincode
      };
      
      // Add form data
      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });
      
      // Add profile image if changed
      const profileInput = document.getElementById("rpsProfileUpload");
      if (profileInput && profileInput.files[0]) {
        data.append("profileImage", profileInput.files[0]);
      }
      
      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }
      
      // Update localStorage with new user data - preserve the image field
      const updatedUser = { 
        ...user, 
        name: responseData.name || user.name,
        city: responseData.city || user.city,
        dateOfBirth: responseData.dateOfBirth || user.dateOfBirth,
        gender: responseData.gender || user.gender,
        address: responseData.address || user.address,
        pincode: responseData.pincode || user.pincode,
        profileImage: responseData.profileImage || user.profileImage
      };
      localStorage.setItem("qr_user", JSON.stringify(updatedUser));
      
      // Update profile image display
      if (responseData.profileImage) {
        const imageUrl = `http://localhost:4000/uploads/${responseData.profileImage}`;
        setProfilePic(imageUrl);
        console.log('Profile image updated:', imageUrl);
      }
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      // Refresh data
      loadUserData();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage("❌ " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rps-page">
      {/* Navbar */}
      <div className="rps-navbar">
        <img src="logo1.png" alt="QuickRent Logo" className="rps-logo" />
        <h1>QuickRent – Profile Settings</h1>
      </div>
      
      <button 
          type="button" 
          onClick={() => navigate('/renter/dashboard')}
          className="back-to-dashboard-btn"
          aria-label="Back to Renter Dashboard"
          style={{marginBottom: '20px',
            marginTop: '20px',
            marginLeft: '30px'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>

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
            {errorMessage && (
              <div className="rps-error-message" style={{
                backgroundColor: '#fee',
                color: '#c00',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                border: '1px solid #fcc'
              }}>
                {errorMessage}
              </div>
            )}
            {showSuccessMessage && (
              <div className="rps-success-message">
                <i className="fas fa-check-circle"></i>
                Profile details saved successfully!
              </div>
            )}
            <button 
              className="rps-btn" 
              onClick={handleSaveDetails}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                'Save details'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ownerdetail.css";

export default function Ownerdetail() {
  const [profileImage, setProfileImage] = useState("default-profile.png");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    joinDate: "",
    totalVehicles: 0,
    totalBookings: 0,
    totalEarnings: 0
  });
  const [loginHistory, setLoginHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [savedDetails, setSavedDetails] = useState(null);
  const [showSavedInfo, setShowSavedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    loadLoginHistory();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      // Use the user data from localStorage as fallback
      const userData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        createdAt: user.createdAt || new Date().toISOString(),
        totalVehicles: 0,
        totalBookings: 0,
        totalEarnings: 0
      };

      // Try to fetch from API, but use localStorage data if API fails
      try {
        const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const apiData = await response.json();
          Object.assign(userData, apiData);
        }
      } catch (apiError) {
        console.log("Using localStorage data as API failed:", apiError);
      }
      
      // Auto-populate form with user data
      setFormData({
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        city: userData.city || "",
        joinDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : "",
        totalVehicles: userData.totalVehicles || 0,
        totalBookings: userData.totalBookings || 0,
        totalEarnings: userData.totalEarnings || 0
      });

      if (userData.profileImage) {
        setProfileImage(`/uploads/${userData.profileImage}`);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadLoginHistory = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) return;

      const response = await fetch(`http://localhost:4000/api/users/${user.id}/login-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLoginHistory(data);
      }
    } catch (error) {
      console.error("Error loading login history:", error);
    }
  };

  // Handle profile upload & preview
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setMessage("❌ Invalid file type. Only JPG, JPEG, and PNG files are allowed.");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ File size too large. Maximum size is 5MB.");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target.result);
      reader.readAsDataURL(file);
      setMessage("✅ Profile image updated successfully!");
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        setMessage("❌ Please login to update profile");
        return;
      }

      const data = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // Add profile image if changed
      const profileInput = document.getElementById("odProfileUpload");
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

      // Update localStorage with new user data
      const updatedUser = { ...user, ...responseData };
      localStorage.setItem("qr_user", JSON.stringify(updatedUser));

      // Update profile image display
      if (responseData.profileImage) {
        setProfileImage(`/uploads/${responseData.profileImage}`);
      }

      setMessage("✅ Profile updated successfully!");
      
      // Save the updated details to show in left panel
      setSavedDetails({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        joinDate: formData.joinDate,
        totalVehicles: formData.totalVehicles,
        totalBookings: formData.totalBookings,
        totalEarnings: formData.totalEarnings,
        profileImage: responseData.profileImage || profileImage
      });
      setShowSavedInfo(true);
      
      // Refresh the page data
      loadUserData();
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="OWD">
      {/* Navbar */}
      <div className="od-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="od-logo" />
        <h1>QuickRent - Owner Details</h1>
      </div>

      {/* Container */}
      <div className="od-details-container">
        {/* Left Side Panel - Saved Information */}
        {showSavedInfo && savedDetails && (
          <div className="od-left-panel">
            <div className="saved-info-header">
              <h3><i className="fas fa-check-circle"></i> Saved Information</h3>
              <button 
                className="close-panel-btn"
                onClick={() => setShowSavedInfo(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="saved-info-content">
              <div className="saved-profile-image">
                <img 
                  src={savedDetails.profileImage} 
                  alt="Profile" 
                  className="saved-profile-img" 
                />
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{savedDetails.fullName}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{savedDetails.email}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{savedDetails.phone}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">City:</span>
                <span className="info-value">{savedDetails.city}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Joined:</span>
                <span className="info-value">{formatDate(savedDetails.joinDate)}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Vehicles:</span>
                <span className="info-value">{savedDetails.totalVehicles}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Bookings:</span>
                <span className="info-value">{savedDetails.totalBookings}</span>
              </div>
              
              <div className="saved-info-item">
                <span className="info-label">Earnings:</span>
                <span className="info-value">{formatCurrency(savedDetails.totalEarnings)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`od-main-content ${showSavedInfo ? 'with-panel' : ''}`}>
          {/* Tabs */}
          <div className="od-tabs">
            <button 
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user"></i> Profile Details
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="od-profile-section">
              <div className="profile-layout">
                {/* Left Box - Profile Image */}
                <div className="profile-left-box">
                  <h3><i className="fas fa-user"></i> Profile</h3>
                  <div className="profile-image-container">
                    <img src={profileImage} alt="Profile" className="od-profile-img" />
                    <div className="profile-upload">
                      <input
                        type="file"
                        id="odProfileUpload"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleProfileChange}
                      />
                      <label htmlFor="odProfileUpload" className="od-upload-label">
                        <i className="fas fa-upload"></i> Upload Photo
                      </label>
                      <small>JPG, PNG only (max 5MB)</small>
                    </div>
                  </div>
                </div>

                {/* Right Box - Form */}
                <div className="profile-right-box">
                  <h3><i className="fas fa-user-edit"></i> Profile Information</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="od-form-group">
                        <label htmlFor="ownerName">
                          <i className="fas fa-user"></i> Full Name *
                        </label>
                        <input 
                          type="text" 
                          id="ownerName" 
                          value={formData.fullName}
                          onChange={handleInputChange("fullName")}
                          placeholder="Enter your full name" 
                          required 
                        />
                      </div>
                      
                      <div className="od-form-group">
                        <label htmlFor="ownerEmail">
                          <i className="fas fa-envelope"></i> Email Address
                        </label>
                        <input 
                          type="email" 
                          id="ownerEmail" 
                          value={formData.email}
                          onChange={handleInputChange("email")}
                          placeholder="Enter your email" 
                          disabled
                        />
                        <small>Email cannot be changed</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="od-form-groupp">
                        <label htmlFor="ownerPhone">
                          <i className="fas fa-phone"></i> Phone Number
                        </label>
                        <input 
                          type="tel" 
                          id="ownerPhone" 
                          value={formData.phone}
                          onChange={handleInputChange("phone")}
                          placeholder="Enter your phone number" 
                          disabled
                        />
                        <small>Phone number cannot be changed</small>
                      </div>
                      
                      <div className="od-form-groupp">
                        <label htmlFor="ownerCity">
                          <i className="fas fa-map-marker-alt"></i> City *
                        </label>
                        <input 
                          type="text" 
                          id="ownerCity" 
                          value={formData.city}
                          onChange={handleInputChange("city")}
                          placeholder="Enter your city" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="od-form-groupp">
                        <label htmlFor="ownerJoin">
                          <i className="fas fa-calendar"></i> Joined On
                        </label>
                        <input 
                          type="date" 
                          id="ownerJoin" 
                          value={formData.joinDate}
                          onChange={handleInputChange("joinDate")}
                          disabled
                        />
                        <small>Account creation date</small>
                      </div>
                      
                      <div className="od-form-groupp">
                        <label htmlFor="totalVehicles">
                          <i className="fas fa-car"></i> Total Vehicles Listed
                        </label>
                        <input 
                          type="number" 
                          id="totalVehicles" 
                          value={formData.totalVehicles}
                          onChange={handleInputChange("totalVehicles")}
                          placeholder="0" 
                          disabled
                        />
                        <small>Auto-calculated</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="od-form-groupp">
                        <label htmlFor="totalBookings">
                          <i className="fas fa-calendar-check"></i> Total Bookings
                        </label>
                        <input 
                          type="number" 
                          id="totalBookings" 
                          value={formData.totalBookings}
                          onChange={handleInputChange("totalBookings")}
                          placeholder="0" 
                          disabled
                        />
                        <small>Auto-calculated</small>
                      </div>
                      
                      <div className="od-form-groupp">
                        <label htmlFor="totalEarnings">
                          <i className="fas fa-rupee-sign"></i> Total Earnings
                        </label>
                        <input 
                          type="text" 
                          id="totalEarnings" 
                          value={formatCurrency(formData.totalEarnings)}
                          placeholder="₹0" 
                          disabled
                        />
                        <small>Auto-calculated</small>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="od-submit-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i> Save Details
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

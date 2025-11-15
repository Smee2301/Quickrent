import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ownerdetail.css";

export default function Ownerdetail() {
  const [profileImage, setProfileImage] = useState("/logo1.png");
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
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    loadLoginHistory();
    calculateTotals();
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
        setProfileImage(`http://localhost:4000/uploads/${userData.profileImage}`);
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

  const calculateTotals = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        console.log("No token or user ID found");
        return;
      }

      console.log("Calculating totals for user:", user.id);

      // Calculate total vehicles - use the same endpoint as ViewListedVehicles
      const vehiclesResponse = await fetch(`http://localhost:4000/api/vehicles/owner/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      let totalVehicles = 0;
      if (vehiclesResponse.ok) {
        const vehicles = await vehiclesResponse.json();
        totalVehicles = vehicles.length;
        console.log("Found vehicles:", vehicles.length, vehicles);
      } else {
        console.error("Vehicles API error:", vehiclesResponse.status, await vehiclesResponse.text());
      }

      // Calculate total bookings
      const bookingsResponse = await fetch(`http://localhost:4000/api/bookings/owner/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      let totalBookings = 0;
      let totalEarnings = 0;
      
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        totalBookings = bookings.length;
        console.log("Found bookings:", bookings.length, bookings);
        
        // Calculate total earnings (sum of all completed bookings)
        totalEarnings = bookings
          .filter(booking => booking.status === 'completed' || booking.status === 'confirmed')
          .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      } else {
        console.error("Bookings API error:", bookingsResponse.status, await bookingsResponse.text());
        // No fallback. If API fails or returns none, keep zeroes so UI reflects reality.
      }

      console.log("Calculated totals:", { totalVehicles, totalBookings, totalEarnings });

      // Update form data with calculated totals
      setFormData(prev => ({
        ...prev,
        totalVehicles,
        totalBookings,
        totalEarnings
      }));

    } catch (error) {
      console.error("Error calculating totals:", error);
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
        setProfileImage(`http://localhost:4000/uploads/${responseData.profileImage}`);
      }

      setMessage("✅ Details saved successfully!");
      
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
      
      // Refresh the page data and recalculate totals
      loadUserData();
      calculateTotals();
      
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
        {/* Left sidebar removed as requested */}

        {/* Main Content */}
        <div className={`od-main-content`}>
          <button 
            type="button" 
            onClick={() => navigate('/owner/dashboard')}
            className="back-OWND-btn"
            aria-label="Back to Owner Dashboard"
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
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
                      
                      {/* <div className="od-form-groupp">
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
                      </div> */}
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
                      
                      <button 
                        type="button" 
                        className="od-refresh-btn"
                        onClick={calculateTotals}
                        style={{ 
                          marginLeft: '10px', 
                          background: '#6c757d', 
                          color: 'white', 
                          border: 'none', 
                          padding: '12px 20px', 
                          borderRadius: '8px', 
                          cursor: 'pointer' 
                        }}
                      >
                        <i className="fas fa-sync-alt"></i> Refresh Totals
                      </button>
                      
                      {!isLoading && message && !message.includes('❌') && (
                        <div style={{ marginTop: '10px', color: '#16a34a', fontWeight: 600 }}>
                          Details saved successfully
                        </div>
                      )}
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

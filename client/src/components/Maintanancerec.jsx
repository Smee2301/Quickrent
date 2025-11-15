import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Maintanancerec.css";

export default function Maintanancerec() {
  const [activeTab, setActiveTab] = useState("view");
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    date: "",
    cost: "",
    notes: "",
    documents: null
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
    fetchMaintenanceRecords();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      const response = await fetch(`http://localhost:4000/api/vehicles/owner/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchMaintenanceRecords = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      const response = await fetch(`http://localhost:4000/api/maintenance/owner/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMaintenanceRecords(data);
      }
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg", 
        "image/png"
      ];

      if (!allowedTypes.includes(file.type)) {
        setMessage("❌ Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ File size too large. Maximum size is 5MB.");
        e.target.value = "";
        return;
      }

      setFormData(prev => ({ ...prev, documents: file }));
      setMessage("✅ Document uploaded successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        setMessage("❌ Please login to add maintenance record");
        return;
      }

      const data = new FormData();
      
      // Add ownerId
      data.append("ownerId", user.id);
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      const response = await fetch("http://localhost:4000/api/maintenance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add maintenance record");
      }

      const responseData = await response.json();
      console.log("Maintenance record added successfully:", responseData);

      setMessage("✅ Maintenance record added successfully!");
      setFormData({
        vehicleId: "",
        serviceType: "",
        date: "",
        cost: "",
        notes: "",
        documents: null
      });
      
      // Refresh the records
      fetchMaintenanceRecords();
      
      // Switch to view tab
      setTimeout(() => {
        setActiveTab("view");
      }, 2000);
    } catch (error) {
      console.error("Error adding maintenance record:", error);
      setMessage("❌ " + error.message);
    }
  };

  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedRecord(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getVehicleName = (vehicleId) => {
    // Check if vehicleId is populated (has brand/model) or just an ID
    if (vehicleId && typeof vehicleId === 'object' && vehicleId.brand) {
      return `${vehicleId.brand} ${vehicleId.model} - ${vehicleId.vehicleNumber}`;
    }
    
    // Fallback to vehicles array if not populated
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (vehicle) {
      return `${vehicle.brand} ${vehicle.model} - ${vehicle.vehicleNumber}`;
    }
    return 'Unknown Vehicle';
  };

  if (loading) {
    return (
      <div className="Maintanancerec-page">
        <div className="navbar1">
          <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
          <h1>QuickRent - Maintenance Log</h1>
        </div>
        <div className="conntainer">
          <div className="loading">Loading maintenance records...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Maintanancerec-page">
      {/* Navbar */}
      <div className="navbar1">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h1>QuickRent - Maintenance Log</h1>
      </div>


      {/* Main Content */}
      <div className="conntainer">
        <div className="header-actionss">
          <h2>Vehicle Maintenance Log</h2>
          <button 
            className="mtn-back"
            onClick={() => navigate("/owner/dashboard")}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
            onClick={() => setActiveTab("view")}
          >
            <i className="fas fa-list"></i> View Records
          </button>
          <button
            className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            <i className="fas fa-plus"></i> Add Record
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* View Records */}
        {activeTab === "view" && (
          <div id="view" className="tab-content active">
            <div className="search-bar">
              <input type="text" placeholder="Search by vehicle or service..." />
              <i className="fas fa-search"></i>
            </div>
            
            {maintenanceRecords.length === 0 ? (
              <div className="no-records">
                <i className="fas fa-tools"></i>
                <h3>No maintenance records found</h3>
                <p>Start by adding your first maintenance record</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab("add")}
                >
                  Add First Record
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Service Type</th>
                      <th>Date</th>
                      <th>Cost</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceRecords.map((record) => (
                      <tr key={record._id}>
                        <td>{getVehicleName(record.vehicleId)}</td>
                        <td>{record.serviceType}</td>
                        <td>{formatDate(record.date)}</td>
                        <td>{formatCurrency(record.cost)}</td>
                        <td>
                          {record.notes?.length > 50 
                            ? `${record.notes.substring(0, 50)}...` 
                            : record.notes
                          }
                        </td>
                        <td>
                          <button 
                            className="btn-view"
                            onClick={() => viewRecordDetails(record)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Record */}
        {activeTab === "add" && (
          <div id="add" className="tab-content active">
            <form onSubmit={handleSubmit}>
              <div className="form-group1">
                <label>
                  <i className="fas fa-car"></i> Vehicle *
                </label>
                <select 
                  value={formData.vehicleId} 
                  onChange={handleInputChange("vehicleId")}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.vehicleNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group1">
                <label>
                  <i className="fas fa-tools"></i> Service Type *
                </label>
                <select 
                  value={formData.serviceType} 
                  onChange={handleInputChange("serviceType")}
                  required
                >
                  <option value="">Select Service Type</option>
                  <option value="Oil Change">Oil Change</option>
                  <option value="Tire Replacement">Tire Replacement</option>
                  <option value="Brake Service">Brake Service</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="General Service">General Service</option>
                  <option value="AC Service">AC Service</option>
                  <option value="Engine Repair">Engine Repair</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group1">
                <label>
                  <i className="fas fa-calendar"></i> Service Date *
                </label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={handleInputChange("date")}
                  max={new Date().toISOString().split("T")[0]}
                  required 
                />
              </div>
              
              <div className="form-group1">
                <label>
                  <i className="fas fa-rupee-sign"></i> Cost (₹) *
                </label>
                <input 
                  type="number" 
                  value={formData.cost}
                  onChange={handleInputChange("cost")}
                  placeholder="Enter service cost"
                  min="0"
                  required 
                />
              </div>
              
              <div className="form-group1">
                <label>
                  <i className="fas fa-file-upload"></i> Upload Documents
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <small>Upload service receipt or documents (PDF, JPG, PNG - max 5MB)</small>
              </div>
              
              <div className="Notes">
                <label>
                  <i className="fas fa-sticky-note"></i> Service Notes
                </label>
                <textarea 
                  value={formData.notes}
                  onChange={handleInputChange("notes")}
                  placeholder="Describe service details, parts replaced, recommendations..."
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setActiveTab("view")}
                >
                  <i className="fas fa-arrow-left"></i> Back to Records
                </button>
                <button type="submit" className="submit-btn">
                  <i className="fas fa-save"></i> Save Record
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Record Details Popup */}
      {showPopup && selectedRecord && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>
                <i className="fas fa-tools"></i> Maintenance Record Details
              </h3>
              <button className="popup-close" onClick={closePopup}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="popup-body">
              <div className="record-details">
                <div className="detail-row">
                  <span className="label">Vehicle:</span>
                  <span className="value">
                    {getVehicleName(selectedRecord.vehicleId)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Vehicle Number:</span>
                  <span className="value">
                    {selectedRecord.vehicleId?.vehicleNumber || getVehicleName(selectedRecord.vehicleId).split(' - ')[2]}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Service Type:</span>
                  <span className="value">{selectedRecord.serviceType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Service Date:</span>
                  <span className="value">{formatDate(selectedRecord.date)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Cost:</span>
                  <span className="value">{formatCurrency(selectedRecord.cost)}</span>
                </div>
                {selectedRecord.notes && (
                  <div className="detail-row">
                    <span className="label">Notes:</span>
                    <span className="value">{selectedRecord.notes}</span>
                  </div>
                )}
                {selectedRecord.documents && (
                  <div className="detail-row">
                    <span className="label">Documents:</span>
                    <span className="value">
                      <a 
                        href={`/uploads/${selectedRecord.documents}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        <i className="fas fa-file"></i> View Document
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn-primary" onClick={closePopup}>
                <i className="fas fa-check"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

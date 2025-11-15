import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/VehicleSecurity.css";

export default function VehicleSecurity() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [securityPoints, setSecurityPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
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
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Load security points for the selected vehicle
    loadSecurityPoints(vehicle._id);
  };

  const loadSecurityPoints = async (vehicleId) => {
    try {
      // For now, we'll use mock data since the security points API doesn't exist yet
      setSecurityPoints([
        { id: 1, type: 'insurance', status: 'valid', description: 'Valid Insurance' },
        { id: 2, type: 'rc', status: 'valid', description: 'RC Book' },
        { id: 3, type: 'pollution', status: 'valid', description: 'Pollution Certificate' }
      ]);
    } catch (error) {
      console.error("Error loading security points:", error);
    }
  };

  const addSecurityPoint = async (point) => {
    try {
      // For now, we'll just add to local state since the API doesn't exist yet
      const newPoint = {
        id: Date.now(),
        ...point
      };
      setSecurityPoints(prev => [...prev, newPoint]);
      setMessage("✅ Security point added successfully!");
    } catch (error) {
      setMessage("❌ Failed to add security point");
    }
  };

  const removeSecurityPoint = async (pointId) => {
    try {
      // For now, we'll just remove from local state since the API doesn't exist yet
      setSecurityPoints(prev => prev.filter(point => point.id !== pointId));
      setMessage("✅ Security point removed successfully!");
    } catch (error) {
      setMessage("❌ Failed to remove security point");
    }
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

  if (loading) {
    return (
      <div className="vehicle-security-page">
                 <div className="navbar">
           <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
           <h2>QuickRent - Vehicle Security</h2>
         </div>
        <div className="container">
          <div className="loading">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-security-page">
      {/* Navbar */}
      <div className="n">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h1>QuickRent - Vehicle Security</h1>
      </div>

      {/* Main Content */}
      <div className="c">
        <div className="header-actions">
          <h2>Vehicle Security Management</h2>
          <button 
            className="btn-back1"
            onClick={() => navigate("/owner/dashboard")}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="security-content">
          {/* Vehicle Selection */}
          <div className="vehicle-selection">
            <h3>Select Vehicle</h3>
            {vehicles.length === 0 ? (
              <div className="no-vehicles">
                <i className="fas fa-car"></i>
                <h4>No vehicles found</h4>
                <p>Add vehicles to manage their security settings</p>
                <Link to="/owner/add-vehicle" className="btn-primary">
                  Add Vehicle
                </Link>
              </div>
            ) : (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => (
                  <div 
                    key={vehicle._id} 
                    className={`vehicle-card ${selectedVehicle?._id === vehicle._id ? 'selected' : ''}`}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <img 
                      src={vehicle.photo ? `http://localhost:4000/uploads/${vehicle.photo}` : '/vlist.jpeg'} 
                      alt={vehicle.brand}
                      className="vehicle-image"
                      onError={(e) => {
                        if (!e.target.src.includes('/vlist.jpeg')) {
                          e.target.src = '/vlist.jpeg';
                        }
                      }}
                    />
                    <div className="vehicle-info">
                      <h4>{vehicle.brand} {vehicle.model}</h4>
                      <p>{vehicle.vehicleNumber}</p>
                      <span className="vehicle-type">{vehicle.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Points */}
          {selectedVehicle && (
            <div className="security-points">
              <div className="security-header">
                <h3>Security Points for {selectedVehicle.brand} {selectedVehicle.model}</h3>
                {/* <button className="btn-add-point" onClick={() => addSecurityPoint({
                  type: "general",
                  description: "New security point",
                  priority: "medium"
                })}>
                  <i className="fas fa-plus"></i> Add Point
                </button> */}
              </div>

              <div className="security-grid">
                {/* Predefined Security Points */}
                <div className="security-category">
                  <h4><i className="fas fa-shield-alt"></i> Essential Security</h4>
                  <div className="security-items">
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Valid Insurance</span>
                      <span className="status valid">Valid</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>RC Book</span>
                      <span className="status valid">Valid</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Pollution Certificate</span>
                      <span className="status valid">Valid</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Fitness Certificate</span>
                      <span className="status warning">Expires Soon</span>
                    </div>
                  </div>
                </div>

                <div className="security-category">
                  <h4><i className="fas fa-tools"></i> Maintenance Status</h4>
                  <div className="security-items">
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Engine Health</span>
                      <span className="status valid">Good</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Brake System</span>
                      <span className="status valid">Good</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Tire Condition</span>
                      <span className="status warning">Check Required</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-times-circle"></i>
                      <span>AC System</span>
                      <span className="status invalid">Service Required</span>
                    </div>
                  </div>
                </div>

                <div className="security-category">
                  <h4><i className="fas fa-camera"></i> Safety Features</h4>
                  <div className="security-items">
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Airbags</span>
                      <span className="status valid">Functional</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>ABS</span>
                      <span className="status valid">Functional</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>GPS Tracking</span>
                      <span className="status valid">Active</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-plus-circle"></i>
                      <span>Dash Cam</span>
                      <span className="status optional">Optional</span>
                    </div>
                  </div>
                </div>

                <div className="security-category">
                  <h4><i className="fas fa-file-alt"></i> Documentation</h4>
                  <div className="security-items">
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Service History</span>
                      <span className="status valid">Updated</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Owner Documents</span>
                      <span className="status valid">Verified</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Insurance Renewal</span>
                      <span className="status warning">Due Soon</span>
                    </div>
                    <div className="security-item">
                      <i className="fas fa-times-circle"></i>
                      <span>Pollution Test</span>
                      <span className="status invalid">Expired</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Score */}
              <div className="security-score">
                <div className="score-card">
                  <div className="score-circle">
                    <span className="score-number">85</span>
                    <span className="score-label">Security Score</span>
                  </div>
                  <div className="score-breakdown">
                    <div className="score-item">
                      <span className="score-label">Essential</span>
                      <div className="score-bar">
                        <div className="score-fill" style={{width: '90%'}}></div>
                      </div>
                      <span className="score-value">90%</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Maintenance</span>
                      <div className="score-bar">
                        <div className="score-fill" style={{width: '75%'}}></div>
                      </div>
                      <span className="score-value">75%</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Safety</span>
                      <div className="score-bar">
                        <div className="score-fill" style={{width: '95%'}}></div>
                      </div>
                      <span className="score-value">95%</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Documentation</span>
                      <div className="score-bar">
                        <div className="score-fill" style={{width: '80%'}}></div>
                      </div>
                      <span className="score-value">80%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations">
                <h4><i className="fas fa-lightbulb"></i> Security Recommendations</h4>
                <div className="recommendation-list">
                  <div className="recommendation-item">
                    <i className="fas fa-exclamation-triangle"></i>
                    <div>
                      <strong>Schedule AC Service</strong>
                      <p>The AC system requires maintenance to ensure optimal performance</p>
                    </div>
                  </div>
                  <div className="recommendation-item">
                    <i className="fas fa-calendar"></i>
                    <div>
                      <strong>Renew Insurance</strong>
                      <p>Insurance expires in 15 days. Renew to maintain coverage</p>
                    </div>
                  </div>
                  <div className="recommendation-item">
                    <i className="fas fa-tools"></i>
                    <div>
                      <strong>Check Tire Condition</strong>
                      <p>Inspect tires for wear and tear to ensure safety</p>
                    </div>
                  </div>
                  <div className="recommendation-item">
                    <i className="fas fa-file-alt"></i>
                    <div>
                      <strong>Update Pollution Certificate</strong>
                      <p>Pollution certificate has expired. Get it renewed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Fullvehicledetail.css";

export default function Fullvehicledetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchVehicleDetails();
    } else {
      setError("No vehicle ID provided");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true); // ✅ reset before fetch
      const token = localStorage.getItem("qr_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:4000/api/vehicles/vehicle/${id}`,
        { headers }
      );

      if (!response.ok) {
        let message = "Failed to load vehicle details";
        try {
          const errData = await response.json();
          if (errData && errData.message) message = errData.message;
        } catch (_) {}
        throw new Error(message);
      }

      const data = await response.json();
      setVehicle(data);
      setError("");
    } catch (err) {
      console.error("Error fetching vehicle details:", err);
      setError("Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="fullvehicledet">
        <div className="fullvehicle-container">
          <div className="loading">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="fullvehicledet">
        <div className="fullvehicle-container">
          <div className="error-message">{error || "Vehicle not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fullvehicledet">
      {/* Navbar */}
      <div className="fullvehicle-navbar">
        <img
          src="/logo1.png"
          alt="QuickRent Logo"
          className="fullvehicle-logo"
        />
        <h1>QuickRent - Full Vehicle Details</h1>
      </div>

      {/* Container */}
      <div className="fullvehicle-container">
        {/* Actions */}
        <div className="fullvehicle-actions">
          <button
            className="btn-back"
            onClick={() => navigate("/owner/view-vehicles")}
          >
            <i className="fas fa-arrow-left"></i> Back to Vehicles
          </button>
          <button
            className="btn-edit"
            onClick={() => navigate(`/owner/edit-vehicle/${vehicle._id}`)}
          >
            <i className="fas fa-edit"></i> Edit Vehicle
          </button>
        </div>

        {/* Vehicle Details */}
        <div className="vehicle-details-section">
          <div className="vehicle-header">
            <h2>
              {vehicle.brand} {vehicle.model}
            </h2>
            <span className="vehicle-year">{vehicle.year}</span>
          </div>

          {/* Main Vehicle Image */}
          <div className="vehicle-image-section">
            <img
              src={
                vehicle.photo ? `http://localhost:4000/uploads/${vehicle.photo}` : "/vlist.jpeg"
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="main-vehicle-image"
              onError={(e) => {
                if (e.target.src.indexOf("vlist.jpeg") === -1) {
                  e.target.src = "/vlist.jpeg"; // ✅ fallback only once
                }
              }}
            />
          </div>

          {/* Basic Information */}
          <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Vehicle Type:</span>
                <span className="info-value">{vehicle.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color:</span>
                <span className="info-value">{vehicle.color}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vehicle Number:</span>
                <span className="info-value">{vehicle.vehicleNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fuel Type:</span>
                <span className="info-value">{vehicle.fuelType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Transmission:</span>
                <span className="info-value">{vehicle.transmission}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mileage:</span>
                <span className="info-value">{vehicle.mileage} km</span>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="info-section">
            <h3>Pricing & Rental Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Rent per Hour:</span>
                <span className="info-value price">
                  {formatCurrency(vehicle.rentPerHour)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Rent per Day:</span>
                <span className="info-value price">
                  {formatCurrency(vehicle.rentPerDay)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Security Deposit:</span>
                <span className="info-value price">
                  {formatCurrency(vehicle.securityDeposit)}
                </span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="info-section">
            <h3>Location & Availability</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Pickup Location:</span>
                <span className="info-value">{vehicle.pickupLocation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Return Location:</span>
                <span className="info-value">{vehicle.returnLocation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Max Distance:</span>
                <span className="info-value">{vehicle.maxDistance} km</span>
              </div>
              <div className="info-item">
                <span className="info-label">Available From:</span>
                <span className="info-value">
                  {formatDate(vehicle.availableFrom)}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="info-section">
              <h3>Vehicle Features</h3>
              <div className="features-grid">
                {vehicle.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    <i className="fas fa-check"></i> {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="info-section">
            <h3>Vehicle Documents</h3>
            <div className="documents-grid">
              {vehicle.documents?.rc && (
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span>RC Document</span>
                  <a
                    href={`http://localhost:4000/uploads/${vehicle.documents.rc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    View
                  </a>
                </div>
              )}
              {vehicle.documents?.insurance && (
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span>Insurance Document</span>
                  <a
                    href={`http://localhost:4000/uploads/${vehicle.documents.insurance}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    View
                  </a>
                </div>
              )}
              {vehicle.documents?.pollution && (
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span>Pollution Certificate</span>
                  <a
                    href={`http://localhost:4000/uploads/${vehicle.documents.pollution}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {vehicle.notes && (
            <div className="info-section">
              <h3>Additional Notes</h3>
              <div className="notes-content">
                <p>{vehicle.notes}</p>
              </div>
            </div>
          )}

          {/* Vehicle Status */}
          <div className="info-section">
            <h3>Vehicle Status</h3>
            <div className="status-info">
              <span className="status-badge available">
                <i className="fas fa-check-circle"></i> Available for Rent
              </span>
              <p className="status-description">
                This vehicle is currently available for rental. Contact the
                owner for booking details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

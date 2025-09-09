import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ViewListedVehicles.css";

export default function ViewListedVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      setLoading(true);
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");

      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/vehicles/owner/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch vehicles");
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteVehicle(vehicleId) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const token = localStorage.getItem("qr_token");
      const response = await fetch(
        `http://localhost:4000/api/vehicles/vehicle/${vehicleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
    } catch (err) {
      alert("Error deleting vehicle: " + err.message);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="vlv-page">
        <div className="vlv-container">
          <div className="vlv-loading">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vlv-page">
      <div className="vlv-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="vlv-logo" />
        <h2>QuickRent - Listed Vehicles</h2>
      </div>

      <br />

      <div className="vlv-container">
        {error && <div className="vlv-error">{error}</div>}

        <div className="vlv-actions">
          <Link to="/owner/add-vehicle" className="vlv-btn-add">
            <i className="fa-solid fa-plus"></i>
            Add New Vehicle
          </Link>
          <Link to="/owner/dashboard" className="vlv-btn-back">
            <i className="fa-solid fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="vlv-no-vehicles">
            <i className="fas fa-car"></i>
            <h3>No vehicles found</h3>
            <p>Start by adding your first vehicle</p>
            <Link to="/owner/add-vehicle" className="vlv-btn-primary">
              <i className="fas fa-plus"></i> Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="vlv-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vlv-card">
                {/* Vehicle Image */}
                <div className="vlv-image-container">
                  <img
                    src={
                      vehicle.photo
                        ? `http://localhost:4000/uploads/${vehicle.photo}`
                        : "/vlist.jpeg"
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="vlv-image"
                    onError={(e) => {
                      if (!e.target.src.includes("vlist.jpeg")) {
                        e.target.src = "/vlist.jpeg";
                      }
                    }}
                  />
                  <div className="vlv-status">
                    <span className="vlv-status-badge">Available</span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="vlv-info">
                  <div className="vlv-header">
                    <h3>
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <span className="vlv-year">{vehicle.year}</span>
                  </div>

                  <div className="vlv-details">
                    <div className="vlv-detail-item">
                      <span className="vlv-detail-label">Type:</span>
                      <span className="vlv-detail-value">{vehicle.type}</span>
                    </div>

                    <div className="vlv-detail-item">
                      <span className="vlv-detail-label">Color:</span>
                      <span className="vlv-detail-value">{vehicle.color}</span>
                    </div>

                    <div className="vlv-detail-item">
                      <span className="vlv-detail-label">Number:</span>
                      <span className="vlv-detail-value">
                        {vehicle.vehicleNumber}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="vlv-pricing">
                    <div className="vlv-price-item">
                      <span className="vlv-price-label">Rent/Hour:</span>
                      <span className="vlv-price-value">₹{vehicle.rentPerHour}</span>
                    </div>
                    <div className="vlv-price-item">
                      <span className="vlv-price-label">Deposit:</span>
                      <span className="vlv-price-value">₹{vehicle.securityDeposit}</span>
                    </div>
                  </div>

                  {/* Listed Date */}
                  <div className="vlv-date">
                    <span className="vlv-date-label">Listed:</span>
                    <span className="vlv-date-value">
                      {formatDate(vehicle.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="vlv-card-actions">
                    <Link
                      to={`/owner/vehiclefulldetail/${vehicle._id}`}
                      className="vlv-btn-view"
                    >
                      <i className="fas fa-eye"></i> Full Details
                    </Link>
                    <Link
                      to={`/owner/edit-vehicle/${vehicle._id}`}
                      className="vlv-btn-edit"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    <button
                      onClick={() => deleteVehicle(vehicle._id)}
                      className="vlv-btn-delete"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

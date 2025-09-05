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
      <div className="view-vehicles-page">
        <div className="containerr">
          <div className="loading">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-vehicles-page">
      <div className="navbarr">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h2>QuickRent - Listed Vehicles</h2>
      </div>

      <br />

      <div className="containerr">
        {error && <div className="error-message">{error}</div>}

        <div className="actions">
          <Link to="/owner/add-vehicle" className="btn-add">
            <i className="fa-solid fa-plus"></i>
            Add New Vehicle
          </Link>
          <Link to="/owner/dashboard" className="btn-back">
            <i className="fa-solid fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="no-vehicles">
            <i className="fas fa-car"></i>
            <h3>No vehicles found</h3>
            <p>Start by adding your first vehicle</p>
            <Link to="/owner/add-vehicle" className="btn-primary">
              <i className="fas fa-plus"></i> Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card">
                {/* Vehicle Image */}
                <div className="vehicle-image-container">
                  <img
                    src={
                      vehicle.photo
                        ? `/uploads/${vehicle.photo}`
                        : "/default-car.jpg"
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="vehicle-image"
                    onError={(e) => {
                      if (!e.target.src.includes("default-car.jpg")) {
                        e.target.src = "/default-car.jpg";
                      }
                    }}
                  />
                  <div className="vehicle-status">
                    <span className="status-badge available">Available</span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="vehicle-info">
                  <div className="vehicle-header">
                    <h3>
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <span className="vehicle-year">{vehicle.year}</span>
                  </div>

                  <div className="vehicle-details">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{vehicle.type}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Color:</span>
                      <span className="detail-value">{vehicle.color}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Number:</span>
                      <span className="detail-value">
                        {vehicle.vehicleNumber}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="pricing-section">
                    <div className="price-item">
                      <span className="price-label">Rent/Hour:</span>
                      <span className="price-value">₹{vehicle.rentPerHour}</span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">Deposit:</span>
                      <span className="price-value">
                        ₹{vehicle.securityDeposit}
                      </span>
                    </div>
                  </div>

                  {/* Listed Date */}
                  <div className="listed-date">
                    <span className="date-label">Listed:</span>
                    <span className="date-value">
                      {formatDate(vehicle.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="card-actions">
                    <Link
                      to={`/owner/vehiclefulldetail/${vehicle._id}`}
                      className="btn-view"
                    >
                      <i className="fas fa-eye"></i> Full Details
                    </Link>
                    <Link
                      to={`/owner/edit-vehicle/${vehicle._id}`}
                      className="btn-edit"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    <button
                      onClick={() => deleteVehicle(vehicle._id)}
                      className="btn-delete"
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

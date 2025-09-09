import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddVehicle.css";

export default function EditVehicle() {
  const { id } = useParams();
  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "",
    year: "",
    color: "",
    vehicleNumber: "",
    fuelType: "Petrol",
    transmission: "Manual",
    mileage: "",
    rentPerDay: "",
    rentPerHour: "",
    securityDeposit: "",
    availableFrom: "",
    maxDistance: "",
    pickupLocation: "",
    returnLocation: "",
    notes: "",
    features: [],
  });

  const [files, setFiles] = useState({
    photo: null,
    rc: null,
    insurance: null,
    pollution: null,
  });

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Generate years from 2000 to current year + 1
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const response = await fetch(`http://localhost:4000/api/vehicles/vehicle/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const vehicle = await response.json();
        setForm({
          brand: vehicle.brand || "",
          model: vehicle.model || "",
          type: vehicle.type || "",
          year: vehicle.year || "",
          color: vehicle.color || "",
          vehicleNumber: vehicle.vehicleNumber || "",
          fuelType: vehicle.fuelType || "Petrol",
          transmission: vehicle.transmission || "Manual",
          mileage: vehicle.mileage || "",
          rentPerDay: vehicle.rentPerDay || "",
          rentPerHour: vehicle.rentPerHour || "",
          securityDeposit: vehicle.securityDeposit || "",
          availableFrom: vehicle.availableFrom ? new Date(vehicle.availableFrom).toISOString().split('T')[0] : "",
          maxDistance: vehicle.maxDistance || "",
          pickupLocation: vehicle.pickupLocation || "",
          returnLocation: vehicle.returnLocation || "",
          notes: vehicle.notes || "",
          features: vehicle.features || [],
        });
      } else {
        setMsg("❌ Failed to load vehicle details");
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setMsg("❌ Error loading vehicle details");
    } finally {
      setLoading(false);
    }
  };

  function update(field) {
    return (e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
  }

  function toggleFeature(value) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((v) => v !== value)
        : [...prev.features, value],
    }));
  }

  function handleFileChange(field) {
    return (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = {
          photo: ["image/jpeg", "image/jpg", "image/png"],
          rc: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
          insurance: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
          pollution: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
        };

        if (!allowedTypes[field].includes(file.type)) {
          setMsg(`❌ Invalid file type for ${field}. Only PDF, JPG, and PNG files are allowed.`);
          e.target.value = "";
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setMsg(`❌ File size too large for ${field}. Maximum size is 5MB.`);
          e.target.value = "";
          return;
        }

        setFiles((prev) => ({ ...prev, [field]: file }));
        setMsg(""); // Clear any previous error messages
      }
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        setMsg("❌ Please login to edit a vehicle");
        return;
      }

      const data = new FormData();
      
      // Add form fields
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) {
          if (k === "features" && Array.isArray(v)) {
            data.append(k, JSON.stringify(v));
          } else {
            data.append(k, v);
          }
        }
      });
      
      // Add files
      Object.entries(files).forEach(([k, v]) => {
        if (v) {
          if (k === "photo") {
            data.append("photo", v);
          } else {
            data.append(`documents.${k}`, v);
          }
        }
      });

      const res = await fetch(`http://localhost:4000/api/vehicles/vehicle/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update vehicle");
      }

      const responseData = await res.json();
      console.log("Vehicle updated successfully:", responseData);

      setMsg("✅ Vehicle updated successfully! Redirecting to view vehicles...");
      setTimeout(() => {
        navigate("/owner/view-vehicles");
      }, 2000);
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setMsg("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="add-vehicle-page">
        <div className="ccoontainer">
          <div className="loading">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-vehicle-page">
      <div className="ccoontainer">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h2>Edit Vehicle</h2>

        <form onSubmit={onSubmit}>
          <div>
            <label>Brand *</label>
            <input
              value={form.brand}
              onChange={update("brand")}
              placeholder="e.g., Honda, Toyota, BMW"
              required
            />
          </div>

          <div>
            <label>Model *</label>
            <input
              value={form.model}
              onChange={update("model")}
              placeholder="e.g., Civic, Camry, X5"
              required
            />
          </div>

          <div>
            <label>Vehicle Type *</label>
            <select value={form.type} onChange={update("type")} required>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Van">Van</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div>
            <label>Year *</label>
            <select value={form.year} onChange={update("year")} required>
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Color *</label>
            <input
              value={form.color}
              onChange={update("color")}
              placeholder="e.g., Red, Blue, White"
              required
            />
          </div>

          <div>
            <label>Vehicle Number *</label>
            <input
              value={form.vehicleNumber}
              onChange={update("vehicleNumber")}
              placeholder="e.g., MH12AB1234"
              required
            />
          </div>

          <div>
            <label>Fuel Type *</label>
            <select value={form.fuelType} onChange={update("fuelType")} required>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div>
            <label>Transmission *</label>
            <select value={form.transmission} onChange={update("transmission")} required>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label>Mileage (km) *</label>
            <input
              type="number"
              value={form.mileage}
              onChange={update("mileage")}
              placeholder="e.g., 50000"
              required
            />
          </div>

          <div>
            <label>Rent per Hour (₹) *</label>
            <input
              type="number"
              value={form.rentPerHour}
              onChange={update("rentPerHour")}
              placeholder="e.g., 100"
              required
            />
          </div>

          <div>
            <label>Rent per Day (₹)</label>
            <input
              type="number"
              value={form.rentPerDay}
              onChange={update("rentPerDay")}
              placeholder="e.g., 1000"
            />
          </div>

          <div>
            <label>Security Deposit (₹) *</label>
            <input
              type="number"
              value={form.securityDeposit}
              onChange={update("securityDeposit")}
              placeholder="e.g., 5000"
              required
            />
          </div>

          <div>
            <label>Available From *</label>
            <input
              type="date"
              value={form.availableFrom}
              onChange={update("availableFrom")}
              required
            />
          </div>

          <div>
            <label>Max Distance (km) *</label>
            <input
              type="number"
              value={form.maxDistance}
              onChange={update("maxDistance")}
              placeholder="e.g., 100"
              required
            />
          </div>

          <div>
            <label>Pickup Location *</label>
            <input
              value={form.pickupLocation}
              onChange={update("pickupLocation")}
              placeholder="e.g., Mumbai Central"
              required
            />
          </div>

          <div>
            <label>Return Location *</label>
            <input
              value={form.returnLocation}
              onChange={update("returnLocation")}
              placeholder="e.g., Mumbai Central"
              required
            />
          </div>

          <div>
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={update("notes")}
              placeholder="Additional notes about the vehicle..."
              rows="3"
            />
          </div>
  <br></br>
          <div>
            <label>Vehicle Features</label>
            <div className="features-grid">
              {[
                "AC","GPS","Music System","Airbags","Bluetooth",
              ].map((feature) => (
                <label key={feature} className="feature-checkbox">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
<br></br>
          <div>
            <label>Vehicle Photo *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange("photo")}
            />
            <small>Upload a clear photo of your vehicle</small>
          </div>

          <div>
            <label>RC Document *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange("rc")}
            />
            <small>Upload vehicle registration certificate</small>
          </div>

          <div>
            <label>Insurance Document *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange("insurance")}
            />
            <small>Upload vehicle insurance certificate</small>
          </div>

          <div>
            <label>Pollution Certificate</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange("pollution")}
            />
            <small>Upload pollution under control certificate (optional)</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/owner/view-vehicles")}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Update Vehicle
                </>
              )}
            </button>
          </div>
        </form>

        {msg && (
          <div className={`message ${msg.includes('❌') ? 'error' : 'success'}`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

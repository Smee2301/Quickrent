import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddVehicle.css";

export default function AddVehicle() {
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
  const navigate = useNavigate();

  // Generate years from 2000 to current year + 1
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

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

  const openLocalPreview = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    // Revoke after a short delay to allow open
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        setMsg("❌ Please login to add a vehicle");
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

      const res = await fetch("http://localhost:4000/api/vehicles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save vehicle");
      }

      const responseData = await res.json();
      console.log("Vehicle added successfully:", responseData);

      setMsg("✅ Vehicle added successfully! Redirecting to view vehicles...");
      setTimeout(() => {
        navigate("/owner/view-vehicles");
      }, 2000);
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setMsg("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="add-vehicle-page">
      <div className="ccoontainer">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h2>Add New Vehicle</h2>

        <button
      type="button"
      onClick={() => navigate("/owner/dashboard")}
      className="back-dashboard-btn"
      aria-label="Back to Owner Dashboard"
    >
      <i className="fas fa-arrow-left"></i> Back to Dashboard
       </button>

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
              placeholder="e.g., Red, Blue, Silver"
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
            <select value={form.fuelType} onChange={update("fuelType")}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          {/* <div>
            <label>Transmission *</label>
            <select value={form.transmission} onChange={update("transmission")}>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div> */}

          <div>
            <label>Mileage (km/l) *</label>
            <input
              type="number"
              value={form.mileage}
              onChange={update("mileage")}
              step="0.1"
              placeholder="e.g., 15.5"
              required
            />
          </div>

          {/* <div>
            <label>Rent per Day (₹) *</label>
            <input
              type="number"
              value={form.rentPerDay}
              onChange={update("rentPerDay")}
              placeholder="e.g., 1500"
              min="100"
              required
            />
          </div> */}

          <div>
            <label>Rent per Hour (₹) *</label>
            <input
              type="number"
              value={form.rentPerHour}
              onChange={update("rentPerHour")}
              placeholder="e.g., 200"
              min="50"
              required
            />
          </div>

          <div>
            <label>Security Deposit (₹) *</label>
            <input
              type="number"
              value={form.securityDeposit}
              onChange={update("securityDeposit")}
              placeholder="e.g., 5000"
              min="1000"
              required
            />
          </div>

          <div>
            <label>Available From *</label>
            <input
              type="date"
              value={form.availableFrom}
              onChange={update("availableFrom")}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label>Max Distance Allowed (km) *</label>
            <input
              type="number"
              value={form.maxDistance}
              onChange={update("maxDistance")}
              placeholder="e.g., 200"
              min="50"
              required
            />
          </div>

          <div>
            <label>Pickup Location *</label>
            <input
              value={form.pickupLocation}
              onChange={update("pickupLocation")}
              placeholder="e.g., Mumbai Central Station"
              required
            />
          </div>

          <div>
            <label>Return Location *</label>
            <input
              value={form.returnLocation}
              onChange={update("returnLocation")}
              placeholder="e.g., Same as pickup location"
              required
            />
          </div>

          {/* File Uploads */}
          <div className="form-group full">
            <label>Upload Vehicle Photo *</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange("photo")}
              required
            />
            <small>Only JPG, JPEG, PNG files allowed (max 5MB)</small>
            {files.photo && (
              <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.photo)}>
                <i className="fas fa-eye"></i> View Selected
              </button>
            )}
          </div>

          <div className="form-group full">
            <label>Upload RC Document *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange("rc")}
              required
            />
            <small>Only PDF, JPG, JPEG, PNG files allowed (max 5MB)</small>
            {files.rc && (
              <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.rc)}>
                <i className="fas fa-eye"></i> View Selected
              </button>
            )}
          </div>

          <div className="form-group full">
            <label>Insurance Document *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange("insurance")}
              required
            />
            <small>Only PDF, JPG, JPEG, PNG files allowed (max 5MB)</small>
            {files.insurance && (
              <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.insurance)}>
                <i className="fas fa-eye"></i> View Selected
              </button>
            )}
          </div>

          <div className="form-group full">
            <label>Pollution Certificate *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange("pollution")}
              required
            />
            <small>Only PDF, JPG, JPEG, PNG files allowed (max 5MB)</small>
            {files.pollution && (
              <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.pollution)}>
                <i className="fas fa-eye"></i> View Selected
              </button>
            )}
          </div>

          {/* Features */}
          <div className="form-group full">
            <label>Vehicle Features</label>
            <div className="features">
              {[
                "AC","GPS","Music System","Airbags","Bluetooth",
              ].map((f) => (
                <button
                  type="button"
                  key={f}
                  className={form.features.includes(f) ? "active" : ""}
                  onClick={() => toggleFeature(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group full">
            <label>Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={update("notes")}
              placeholder="Any additional vehicle instructions, special features, or notes..."
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Adding Vehicle..." : "Submit Vehicle"}
          </button>
        </form>

        <div className="submit-message">{msg}</div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rentalhistory.css";
import "../styles/SharedButtons.css";
import logo from "../logo1.png";

export default function Rentalhistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("qr_token");
        const user = JSON.parse(localStorage.getItem("qr_user") || "{}");

        if (!token || !user.id) {
          navigate("/renter/login", { replace: true });
          return;
        }

        const res = await fetch(`http://localhost:4000/api/bookings/renter/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load rental history");
        }

        const data = await res.json();
        // Only past / closed bookings
        const pastStatuses = ["completed", "cancelled", "rejected"];
        const past = (data || []).filter(b => pastStatuses.includes(b.status));
        // Sort latest first
        past.sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
        setHistory(past);
      } catch (err) {
        console.error("Error fetching rental history:", err);
        setError(err.message || "Unable to fetch rental history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const formatDateTime = (date, time) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const datePart = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timePart = time || d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    return `${datePart}, ${timePart}`;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusClass = (status) => {
    if (status === "completed") return "rhis-completed";
    if (status === "cancelled" || status === "rejected") return "rhis-cancelled";
    return "";
  };

  const getStatusLabel = (booking) => {
    const base = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "";
    if (booking.status === "completed") {
      return `${base} - Trip completed`;
    }
    if (booking.status === "cancelled") {
      return `${base} - ${booking.cancellationReason || "Cancelled by renter"}`;
    }
    if (booking.status === "rejected") {
      return `${base} - ${booking.rejectionReason || "Rejected by owner"}`;
    }
    return base || "N/A";
  };

  const downloadAllForBooking = (booking) => {
    try {
      // 1) Download booking summary as JSON
      const summary = {
        bookingId: booking._id,
        status: booking.status,
        createdAt: booking.createdAt,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        pickupTime: booking.pickupTime,
        returnTime: booking.returnTime,
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
        totalHours: booking.totalHours,
        hourlyRate: booking.hourlyRate,
        totalAmount: booking.totalAmount,
        securityDeposit: booking.securityDeposit,
        renterNotes: booking.renterNotes,
        ownerNotes: booking.ownerNotes,
        cancellationReason: booking.cancellationReason,
        rejectionReason: booking.rejectionReason,
        vehicle: booking.vehicleId ? {
          brand: booking.vehicleId.brand,
          model: booking.vehicleId.model,
          vehicleNumber: booking.vehicleId.vehicleNumber,
          type: booking.vehicleId.type,
        } : null,
        owner: booking.ownerId ? {
          name: booking.ownerId.name,
          email: booking.ownerId.email,
          phone: booking.ownerId.phone,
        } : null,
      };

      const jsonBlob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const infoLink = document.createElement("a");
      infoLink.href = jsonUrl;
      infoLink.download = `booking-${booking._id}-summary.json`;
      document.body.appendChild(infoLink);
      infoLink.click();
      document.body.removeChild(infoLink);
      URL.revokeObjectURL(jsonUrl);

      // 2) Download vehicle documents (RC / Insurance / PUC) if available
      const docs = booking.vehicleId?.documents || {};
      Object.entries(docs).forEach(([key, filename]) => {
        if (!filename) return;
        const docUrl = `http://localhost:4000/uploads/${filename}`;
        const link = document.createElement("a");
        link.href = docUrl;
        link.download = `${key}-${filename}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (e) {
      console.error("Download failed", e);
      alert("Unable to download booking documents. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="rhis-page">
        <div className="rhis-navbar">
          <div>
            <img src={logo} alt="QuickRent Logo" className="rhis-logo" />
          </div>
          <h1>QuickRent - Rental History</h1>
        </div>
        <div className="rhis-container">
          <p>Loading your rental history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rhis-page">
      {/* Navbar */}
      <div className="rhis-navbar">
        <div>
          <img src={logo} alt="QuickRent Logo" className="rhis-logo" />
        </div>
        <h1>QuickRent - Rental History</h1>
      </div>

      {/* History Container */}
      <div className="rhis-container">
        <button 
          type="button" 
          onClick={() => navigate('/renter/dashboard')}
          className="back-to-dashboard-btn"
          aria-label="Back to Renter Dashboard"
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        
        <h2>Past Rentals</h2>
        {error && (
          <p style={{ color: "#e74c3c", marginBottom: "12px" }}>{error}</p>
        )}
        {history.length === 0 ? (
          <p>No past rentals found yet. Complete a trip to see it here.</p>
        ) : (
          <table className="rhis-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Pickup</th>
                <th>Return</th>
                <th>Total Cost</th>
                <th>Status / Activity</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {history.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    {booking.vehicleId
                      ? `${booking.vehicleId.brand} ${booking.vehicleId.model} (${booking.vehicleId.vehicleNumber})`
                      : "Vehicle info not available"}
                  </td>
                  <td>{formatDateTime(booking.pickupDate, booking.pickupTime)}</td>
                  <td>{formatDateTime(booking.returnDate, booking.returnTime)}</td>
                  <td>{formatCurrency(booking.totalAmount)}</td>
                  <td className={getStatusClass(booking.status)}>
                    {getStatusLabel(booking)}
                  </td>
                  <td>
                    <button 
                      className="rhis-btn"
                      onClick={() => downloadAllForBooking(booking)}
                    >
                      <i className="fa-solid fa-file-pdf"></i> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

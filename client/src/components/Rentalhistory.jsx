import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rentalhistory.css";
import "../styles/SharedButtons.css";
import logo from "../logo1.png";

export default function Rentalhistory() {
  const navigate = useNavigate();
  const rentals = [
    {
      id: "#QR1024",
      vehicle: "Toyota Innova",
      pickup: "10 Aug 2025, 09:00 AM",
      return: "12 Aug 2025, 06:00 PM",
      cost: "₹4,500",
      status: "Completed",
    },
    {
      id: "#QR1017",
      vehicle: "Hyundai Creta",
      pickup: "05 Aug 2025, 08:00 AM",
      return: "05 Aug 2025, 08:00 PM",
      cost: "₹1,200",
      status: "Cancelled",
    },
    {
      id: "#QR1009",
      vehicle: "Maruti Swift",
      pickup: "25 Jul 2025, 07:30 AM",
      return: "26 Jul 2025, 07:00 PM",
      cost: "₹1,800",
      status: "Completed",
    },
  ];

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
        <table className="rhis-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Vehicle</th>
              <th>Pickup</th>
              <th>Return</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id}>
                <td>{rental.id}</td>
                <td>{rental.vehicle}</td>
                <td>{rental.pickup}</td>
                <td>{rental.return}</td>
                <td>{rental.cost}</td>
                <td
                  className={
                    rental.status === "Completed"
                      ? "rhis-completed"
                      : "rhis-cancelled"
                  }
                >
                  {rental.status}
                </td>
                <td>
                  <button className="rhis-btn">
                    <i className="fa-solid fa-file-pdf"></i> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "../styles/Rentermybooking.css";
import logo from "../logo1.png";

export default function Rentermybooking() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingVehicle, setRatingVehicle] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [ratingReason, setRatingReason] = useState("");

  const openDetails = () => setShowDetailsModal(true);
  const closeDetails = () => setShowDetailsModal(false);

  const openRating = (vehicle) => {
    setRatingVehicle(vehicle);
    setShowRatingModal(true);
  };
  const closeRating = () => setShowRatingModal(false);

  const handleStarClick = (value) => {
    setSelectedStars(value);
  };

  const handleSubmitReview = () => {
    if (!selectedStars) {
      alert("Please select a star rating.");
      return;
    }
    if (!ratingReason.trim()) {
      alert("Please provide feedback for your review.");
      return;
    }
    alert(`✅ Thank you! Your review for ${ratingVehicle} has been submitted.`);
    setShowRatingModal(false);
    setSelectedStars(0);
    setRatingReason("");
  };

  return (
    <div className="rmb-page">
      {/* Navbar */}
      <div className="rmb-navbar">
        <div className="rmb-navbar-left">
          <img src="/logo1.png" alt="QuickRent Logo" className="rmb-logo" />
          <h1>QuickRent - My Bookings</h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="rmb-container">

        {/* Current Bookings */}
        <div className="rmb-section">
          <h2>Current Bookings</h2>
          <div className="rmb-cards">
            <div className="rmb-card" data-vehicle="Toyota Innova">
              <h3>Toyota Innova</h3>
              <div className="rmb-details">
                Pickup: 30 Aug 2025, 10:00 AM<br />
                Return: 30 Aug 2025, 8:00 PM<br />
                Location: Ahmedabad
              </div>
              <div className="rmb-actions">
                <button className="rmb-btn rmb-btn-primary" onClick={openDetails}>View Details</button>
                <button className="rmb-btn rmb-btn-secondary">Cancel Booking</button>
              </div>
            </div>
          </div>
        </div>

        {/* Past Bookings */}
        <div className="rmb-section">
          <h2>Past Bookings</h2>
          <div className="rmb-cards">
            <div className="rmb-card" data-vehicle="Hyundai Creta">
              <h3>Hyundai Creta</h3>
              <div className="rmb-details">
                Pickup: 15 Aug 2025, 9:00 AM<br />
                Return: 16 Aug 2025, 9:00 PM<br />
                Location: Surat
              </div>
              <div className="rmb-actions">
                <button
                  className="rmb-btn rmb-btn-primary"
                  onClick={() => openRating("Hyundai Creta")}
                >
                  Rate & Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cancelled Bookings */}
        <div className="rmb-section">
          <h2>Cancelled Bookings</h2>
          <div className="rmb-cards">
            <div className="rmb-card">
              <h3>Maruti Swift</h3>
              <div className="rmb-details">
                Pickup: 05 Aug 2025, 8:00 AM<br />
                Return: 05 Aug 2025, 5:00 PM<br />
                Location: Baroda
              </div>
              <div className="rmb-actions">
                <button className="rmb-btn rmb-btn-secondary">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && (
        <div className="rmb-modal">
          <div className="rmb-modal-content">
            <span className="rmb-close" onClick={closeDetails}>&times;</span>
            <h3>Booking Details</h3>
            <p><b>Vehicle:</b> Toyota Innova</p>
            <p><b>Pickup Date:</b> 30 Aug 2025, 10:00 AM</p>
            <p><b>Return Date:</b> 30 Aug 2025, 8:00 PM</p>
            <p><b>Pickup Location:</b> Ahmedabad</p>
            <p><b>Status:</b> Confirmed</p>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="rmb-modal">
          <div className="rmb-modal-content">
            <span className="rmb-close" onClick={closeRating}>&times;</span>
            <h3>Rate Your Experience</h3>
            <p><b>Vehicle:</b> {ratingVehicle}</p>
            <div className="rmb-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-star ${selectedStars >= star ? "fa-solid active" : "fa-regular"}`}
                  onClick={() => handleStarClick(star)}
                ></i>
              ))}
            </div>
            <textarea
              rows="4"
              placeholder="Write your feedback here..."
              value={ratingReason}
              onChange={(e) => setRatingReason(e.target.value)}
            />
            <button className="rmb-btn rmb-btn-primary" onClick={handleSubmitReview}>
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

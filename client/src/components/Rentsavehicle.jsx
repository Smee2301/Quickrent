import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rentsavehicle.css";

export default function Rentsavehicle() {
  const navigate = useNavigate();
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    totalHours: 0,
    totalCost: 0
  });

  // Load saved vehicles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedVehicles');
    if (saved) {
      setSavedVehicles(JSON.parse(saved));
    }
  }, []);

  // Remove vehicle from saved list
  const removeVehicle = (vehicleId) => {
    const updatedVehicles = savedVehicles.filter(v => v.id !== vehicleId);
    setSavedVehicles(updatedVehicles);
    localStorage.setItem('savedVehicles', JSON.stringify(updatedVehicles));
  };

  // Open booking modal
  const openBookingModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  // Calculate booking cost
  const calculateBookingCost = () => {
    if (bookingDetails.pickupDate && bookingDetails.returnDate && 
        bookingDetails.pickupTime && bookingDetails.returnTime) {
      const pickup = new Date(`${bookingDetails.pickupDate}T${bookingDetails.pickupTime}`);
      const returnTime = new Date(`${bookingDetails.returnDate}T${bookingDetails.returnTime}`);
      const diffMs = returnTime - pickup;
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      
      setBookingDetails(prev => ({
        ...prev,
        totalHours: diffHours,
        totalCost: diffHours * selectedVehicle.rent
      }));
    }
  };

  // Handle booking
  const handleBooking = () => {
    if (bookingDetails.totalHours > 0) {
      alert(`Booking confirmed! Total cost: ₹${bookingDetails.totalCost} for ${bookingDetails.totalHours} hours`);
      setShowBookingModal(false);
      setBookingDetails({
        pickupDate: "",
        returnDate: "",
        pickupTime: "",
        returnTime: "",
        totalHours: 0,
        totalCost: 0
      });
    }
  };

  return (
    <div className="rsv-page">
      {/* Navbar */}
      <div className="rsv-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="rsv-logo" />
        <h1>QuickRent - Saved Vehicles</h1>
      </div>

      {/* Content */}
      <div className="rsv-container">
        <h2 className="rsv-title">
          Saved Vehicles
        </h2>

        {savedVehicles.length === 0 ? (
          <div className="rsv-empty">
            <h3>No saved vehicles yet</h3>
            <p>Browse vehicles and save your favorites to see them here</p>
            <button 
              className="rsv-browse-btn"
              onClick={() => navigate('/renter/browse-vehicles')}
            >
              <i className="fas fa-search"></i> Browse Vehicles
            </button>
          </div>
        ) : (
          <div className="rsv-list">
            {savedVehicles.map((vehicle) => (
              <div className="rsv-card" key={vehicle.id}>
                <div className="rsv-image-container">
                  <img src={vehicle.img} alt={vehicle.name} />
                  <div className="rsv-vehicle-badge">
                    <span className={`rsv-status ${vehicle.available ? 'available' : 'unavailable'}`}>
                      {vehicle.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                
                <div className="rsv-content">
                  <div className="rsv-header">
                    <h3>{vehicle.name}</h3>
                    <div className="rsv-rating">
                      <span>⭐ {vehicle.rating}</span>
                      <span>({vehicle.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="rsv-details">
                    <p><span className="rsv-highlight">Type:</span> {vehicle.type}</p>
                    <p><span className="rsv-highlight">Fuel:</span> {vehicle.fuel} | <span className="rsv-highlight">Transmission:</span> {vehicle.transmission}</p>
                    <p><span className="rsv-highlight">Rent:</span> ₹{vehicle.rent} / hour</p>
                    <p><span className="rsv-highlight">Location:</span> {vehicle.location}</p>
                    <p><span className="rsv-highlight">Owner:</span> {vehicle.owner}</p>
                  </div>

                  <div className="rsv-features">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="rsv-feature-tag">{feature}</span>
                    ))}
                  </div>

                  <div className="rsv-actions">
                    <button 
                      className="rsv-btn rsv-btn-book" 
                      onClick={() => openBookingModal(vehicle)}
                      disabled={!vehicle.available}
                    >
                      <i className="fas fa-calendar-check"></i> Reserve
                    </button>
                    <button className="rsv-btn rsv-btn-details">
                      <i className="fas fa-info-circle"></i> More Info
                    </button>
                    <button 
                      className="rsv-btn rsv-btn-remove"
                      onClick={() => removeVehicle(vehicle.id)}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && (
        <div className="rsv-modal">
          <div className="rsv-modal-content">
            <div className="rsv-modal-header">
              <h3>Book {selectedVehicle.name}</h3>
              <button 
                className="rsv-modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="rsv-modal-body">
              <div className="rsv-booking-form">
                <div className="rsv-form-group">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    value={bookingDetails.pickupDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, pickupDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="rsv-form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    value={bookingDetails.returnDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, returnDate: e.target.value})}
                    min={bookingDetails.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="rsv-form-group">
                  <label>Pickup Time</label>
                  <input
                    type="time"
                    value={bookingDetails.pickupTime}
                    onChange={(e) => setBookingDetails({...bookingDetails, pickupTime: e.target.value})}
                  />
                </div>
                
                <div className="rsv-form-group">
                  <label>Return Time</label>
                  <input
                    type="time"
                    value={bookingDetails.returnTime}
                    onChange={(e) => setBookingDetails({...bookingDetails, returnTime: e.target.value})}
                  />
                </div>
                
                <button 
                  className="rsv-calculate-btn"
                  onClick={calculateBookingCost}
                >
                  Calculate Cost
                </button>
                
                {bookingDetails.totalHours > 0 && (
                  <div className="rsv-cost-summary">
                    <h4>Booking Summary</h4>
                    <p>Duration: {bookingDetails.totalHours} hours</p>
                    <p>Rate: ₹{selectedVehicle.rent} / hour</p>
                    <p className="rsv-total-cost">Total Cost: ₹{bookingDetails.totalCost}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rsv-modal-footer">
              <button 
                className="rsv-btn-cancel"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button 
                className="rsv-btn-confirm"
                onClick={handleBooking}
                disabled={bookingDetails.totalHours <= 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
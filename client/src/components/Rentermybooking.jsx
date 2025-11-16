import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
import "../styles/Rentermybooking.css";
import "../styles/SharedButtons.css";
import logo from "../logo1.png";

export default function Rentermybooking() {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingVehicle, setRatingVehicle] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [ratingReason, setRatingReason] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showOwnerDetailsModal, setShowOwnerDetailsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);
  
  // Listen for real-time booking updates
  useEffect(() => {
    if (!socket || !connected) return;
    
    socket.on('booking_approved', (data) => {
      fetchBookings(); // Refresh bookings when status changes
    });
    
    socket.on('booking_rejected', (data) => {
      fetchBookings();
    });
    
    socket.on('booking_cancelled', (data) => {
      fetchBookings();
    });
    
    return () => {
      socket.off('booking_approved');
      socket.off('booking_rejected');
      socket.off('booking_cancelled');
    };
  }, [socket, connected]);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('qr_token');
      const user = JSON.parse(localStorage.getItem('qr_user') || '{}');
      
      if (!token || !user.id) {
        navigate('/renter/login');
        return;
      }
      
      const response = await fetch(`http://localhost:4000/api/bookings/renter/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };
  const closeDetails = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

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
  
  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };
  
  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    try {
      // In production, this would integrate with actual payment gateway
      alert(`Payment of ₹${selectedBooking.totalAmount} via ${paymentMethod} initiated. You will be redirected to payment gateway.`);
      
      // Here you would integrate with Razorpay, Stripe, or other payment gateway
      // For now, we'll just mark payment as completed
      
      setShowPaymentModal(false);
      setPaymentMethod('');
      fetchBookings();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'Booked', class: 'status-pending' },
      'approved': { label: 'Approved', class: 'status-approved' },
      'rejected': { label: 'Rejected', class: 'status-rejected' },
      'cancelled': { label: 'Cancelled', class: 'status-cancelled' },
      'completed': { label: 'Completed', class: 'status-completed' },
      'ongoing': { label: 'Ongoing', class: 'status-ongoing' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-pending' };
    return <span className={`rmb-status-badge ${config.class}`}>{config.label}</span>;
  };

  // Check if booking can be cancelled (within 10 hours)
  const canCancelBooking = (booking) => {
    if (!booking.createdAt) return false;
    if (['cancelled', 'completed', 'rejected'].includes(booking.status)) return false;
    
    const bookingTime = new Date(booking.createdAt);
    const currentTime = new Date();
    const hoursSinceBooking = (currentTime - bookingTime) / (1000 * 60 * 60);
    
    return hoursSinceBooking <= 10;
  };

  // Handle cancel booking
  const handleCancelBooking = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('qr_token');
      const response = await fetch(`http://localhost:4000/api/bookings/${booking._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancellationReason: 'Cancelled by renter'
        })
      });
      
      if (response.ok) {
        alert('✅ Booking cancelled successfully!');
        fetchBookings();
      } else {
        const error = await response.json();
        alert('❌ ' + error.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };
  
  const categorizeBookings = () => {
    return {
      current: bookings.filter(b => ['pending', 'approved', 'ongoing'].includes(b.status)),
      past: bookings.filter(b => b.status === 'completed'),
      cancelled: bookings.filter(b => ['rejected', 'cancelled'].includes(b.status))
    };
  };
  
  if (loading) {
    return (
      <div className="rmb-page">
        <div className="rmb-navbar">
          <div className="rmb-navbar-left">
            <img src="/logo1.png" alt="QuickRent Logo" className="rmb-logo" />
            <h1>QuickRent - My Bookings</h1>
          </div>
        </div>
        <div className="rmb-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading bookings...</div>
        </div>
      </div>
    );
  }
  
  const { current, past, cancelled } = categorizeBookings();

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
        <button 
          type="button" 
          onClick={() => navigate('/renter/dashboard')}
          className="back-to-dashboard-btn"
          aria-label="Back to Renter Dashboard"
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>

        {/* Current Bookings */}
        <div className="rmb-section">
          <h2><i className="fas fa-clock"></i> Current Bookings ({current.length})</h2>
          {current.length === 0 ? (
            <p className="rmb-no-bookings">No current bookings</p>
          ) : (
            <div className="rmb-cards">
              {current.map((booking) => (
                <div key={booking._id} className="rmb-card">
                  <div className="rmb-card-image">
                    <img 
                      src={booking.vehicleId?.photo ? `http://localhost:4000/uploads/${booking.vehicleId.photo}` : '/lv1.avif'}
                      alt={`${booking.vehicleId?.brand} ${booking.vehicleId?.model}`}
                    />
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="rmb-card-content">
                    <h3>{booking.vehicleId?.brand} {booking.vehicleId?.model}</h3>
                    <p className="rmb-vehicle-number">{booking.vehicleId?.vehicleNumber}</p>
                    <div className="rmb-details">
                      <p><i className="fas fa-calendar"></i> <strong>Pickup:</strong> {formatDate(booking.pickupDate)} at {booking.pickupTime}</p>
                      <p><i className="fas fa-calendar"></i> <strong>Return:</strong> {formatDate(booking.returnDate)} at {booking.returnTime}</p>
                      <p><i className="fas fa-map-marker-alt"></i> <strong>Location:</strong> {booking.pickupLocation}</p>
                      <p><i className="fas fa-rupee-sign"></i> <strong>Total:</strong> ₹{booking.totalAmount}</p>
                    </div>
                    <div className="rmb-actions">
                      <button className="rmb-btn rmb-btn-primary" onClick={() => openDetails(booking)}>
                        <i className="fas fa-info-circle"></i> View Details
                      </button>
                      {booking.status === 'approved' && (
                        <button className="rmb-btn rmb-btn-success" onClick={() => openPaymentModal(booking)}>
                          <i className="fas fa-credit-card"></i> Pay Now
                        </button>
                      )}
                      {canCancelBooking(booking) && (
                        <button 
                          className="rmb-btn rmb-btn-danger" 
                          onClick={() => handleCancelBooking(booking)}
                          title="Cancel within 10 hours of booking"
                        >
                          <i className="fas fa-times-circle"></i> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div className="rmb-section">
          <h2><i className="fas fa-check-circle"></i> Past Bookings ({past.length})</h2>
          {past.length === 0 ? (
            <p className="rmb-no-bookings">No past bookings</p>
          ) : (
            <div className="rmb-cards">
              {past.map((booking) => (
                <div key={booking._id} className="rmb-card">
                  <div className="rmb-card-image">
                    <img 
                      src={booking.vehicleId?.photo ? `http://localhost:4000/uploads/${booking.vehicleId.photo}` : '/lv1.avif'}
                      alt={`${booking.vehicleId?.brand} ${booking.vehicleId?.model}`}
                    />
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="rmb-card-content">
                    <h3>{booking.vehicleId?.brand} {booking.vehicleId?.model}</h3>
                    <p className="rmb-vehicle-number">{booking.vehicleId?.vehicleNumber}</p>
                    <div className="rmb-details">
                      <p><i className="fas fa-calendar"></i> {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</p>
                      <p><i className="fas fa-map-marker-alt"></i> {booking.pickupLocation}</p>
                      <p><i className="fas fa-rupee-sign"></i> ₹{booking.totalAmount}</p>
                    </div>
                    <div className="rmb-actions">
                      <button className="rmb-btn rmb-btn-primary" onClick={() => openDetails(booking)}>
                        <i className="fas fa-info-circle"></i> View Details
                      </button>
                      <button
                        className="rmb-btn rmb-btn-secondary"
                        onClick={() => openRating(`${booking.vehicleId?.brand} ${booking.vehicleId?.model}`)}
                      >
                        <i className="fas fa-star"></i> Rate & Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancelled Bookings */}
        <div className="rmb-section">
          <h2><i className="fas fa-times-circle"></i> Cancelled/Rejected Bookings ({cancelled.length})</h2>
          {cancelled.length === 0 ? (
            <p className="rmb-no-bookings">No cancelled bookings</p>
          ) : (
            <div className="rmb-cards">
              {cancelled.map((booking) => (
                <div key={booking._id} className="rmb-card">
                  <div className="rmb-card-image">
                    <img 
                      src={booking.vehicleId?.photo ? `http://localhost:4000/uploads/${booking.vehicleId.photo}` : '/lv1.avif'}
                      alt={`${booking.vehicleId?.brand} ${booking.vehicleId?.model}`}
                    />
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="rmb-card-content">
                    <h3>{booking.vehicleId?.brand} {booking.vehicleId?.model}</h3>
                    <p className="rmb-vehicle-number">{booking.vehicleId?.vehicleNumber}</p>
                    <div className="rmb-details">
                      <p><i className="fas fa-calendar"></i> {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</p>
                      <p><i className="fas fa-map-marker-alt"></i> {booking.pickupLocation}</p>
                      {booking.rejectionReason && (
                        <p className="rmb-rejection-reason"><i className="fas fa-exclamation-circle"></i> {booking.rejectionReason}</p>
                      )}
                    </div>
                    <div className="rmb-actions">
                      <button className="rmb-btn rmb-btn-secondary" onClick={() => openDetails(booking)}>
                        <i className="fas fa-info-circle"></i> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="rmb-modal" onClick={closeDetails}>
          <div className="rmb-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="rmb-close" onClick={closeDetails}>&times;</span>
            <h3><i className="fas fa-file-alt"></i> Booking Details</h3>
            
            <div className="rmb-modal-section">
              <h4>Vehicle Information</h4>
              <div className="rmb-modal-vehicle-info">
                <img 
                  src={selectedBooking.vehicleId?.photo ? `http://localhost:4000/uploads/${selectedBooking.vehicleId.photo}` : '/lv1.avif'}
                  alt="Vehicle"
                  className="rmb-modal-vehicle-image"
                />
                <div>
                  <p><b>Vehicle:</b> {selectedBooking.vehicleId?.brand} {selectedBooking.vehicleId?.model}</p>
                  <p><b>Type:</b> {selectedBooking.vehicleId?.type}</p>
                  <p><b>Number:</b> {selectedBooking.vehicleId?.vehicleNumber}</p>
                  <button 
                    className="rmb-btn rmb-btn-link"
                    onClick={() => {
                      setShowDocumentsModal(true);
                      setShowDetailsModal(false);
                    }}
                  >
                    <i className="fas fa-file-pdf"></i> View Vehicle Documents
                  </button>
                </div>
              </div>
            </div>
            
            <div className="rmb-modal-section">
              <h4>Booking Schedule</h4>
              <p><b>Pickup:</b> {formatDate(selectedBooking.pickupDate)} at {selectedBooking.pickupTime}</p>
              <p><b>Return:</b> {formatDate(selectedBooking.returnDate)} at {selectedBooking.returnTime}</p>
              <p><b>Duration:</b> {selectedBooking.totalHours} hours</p>
              <p><b>Pickup Location:</b> {selectedBooking.pickupLocation}</p>
              <p><b>Return Location:</b> {selectedBooking.returnLocation}</p>
            </div>
            
            <div className="rmb-modal-section">
              <h4>Payment Details</h4>
              <p><b>Hourly Rate:</b> ₹{selectedBooking.hourlyRate}/hour</p>
              <p><b>Total Amount:</b> ₹{selectedBooking.totalAmount}</p>
              <p><b>Security Deposit:</b> ₹{selectedBooking.securityDeposit}</p>
            </div>
            
            <div className="rmb-modal-section">
              <h4>Owner Information</h4>
              <p><b>Name:</b> {selectedBooking.ownerId?.name || 'N/A'}</p>
              <p><b>Contact:</b> {selectedBooking.ownerId?.phone || 'N/A'}</p>
              <p><b>Email:</b> {selectedBooking.ownerId?.email || 'N/A'}</p>
            </div>
            
            <div className="rmb-modal-section">
              <h4>Status</h4>
              <p>{getStatusBadge(selectedBooking.status)}</p>
              {selectedBooking.ownerNotes && (
                <p className="rmb-owner-notes"><i className="fas fa-comment"></i> <b>Owner Note:</b> {selectedBooking.ownerNotes}</p>
              )}
              {selectedBooking.rejectionReason && (
                <p className="rmb-rejection-reason"><i className="fas fa-exclamation-circle"></i> <b>Rejection Reason:</b> {selectedBooking.rejectionReason}</p>
              )}
            </div>
            
            {selectedBooking.status === 'approved' && (
              <div className="rmb-modal-actions">
                <button className="rmb-btn rmb-btn-success" onClick={() => {
                  closeDetails();
                  openPaymentModal(selectedBooking);
                }}>
                  <i className="fas fa-credit-card"></i> Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="rmb-modal" onClick={() => setShowPaymentModal(false)}>
          <div className="rmb-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="rmb-close" onClick={() => setShowPaymentModal(false)}>&times;</span>
            <h3><i className="fas fa-credit-card"></i> Payment</h3>
            
            <div className="rmb-payment-summary">
              <h4>Payment Summary</h4>
              <p><b>Vehicle:</b> {selectedBooking.vehicleId?.brand} {selectedBooking.vehicleId?.model}</p>
              <p><b>Duration:</b> {selectedBooking.totalHours} hours</p>
              <p><b>Rental Amount:</b> ₹{selectedBooking.totalAmount}</p>
              <p><b>Security Deposit:</b> ₹{selectedBooking.securityDeposit}</p>
              <hr />
              <p className="rmb-total-amount"><b>Total Payable:</b> ₹{selectedBooking.totalAmount + selectedBooking.securityDeposit}</p>
            </div>
            
            <div className="rmb-payment-methods">
              <h4>Select Payment Method</h4>
              <div className="rmb-payment-options">
                <label className={`rmb-payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="rmb-payment-option-content">
                    <i className="fas fa-mobile-alt"></i>
                    <span>UPI Payment</span>
                    <small>Google Pay, PhonePe, Paytm</small>
                  </div>
                </label>
                
                <label className={`rmb-payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="rmb-payment-option-content">
                    <i className="fas fa-credit-card"></i>
                    <span>Debit/Credit Card</span>
                    <small>Visa, Mastercard, Rupay</small>
                  </div>
                </label>
                
                <label className={`rmb-payment-option ${paymentMethod === 'NetBanking' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="NetBanking"
                    checked={paymentMethod === 'NetBanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="rmb-payment-option-content">
                    <i className="fas fa-university"></i>
                    <span>Net Banking</span>
                    <small>All major banks</small>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="rmb-modal-actions">
              <button className="rmb-btn rmb-btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="rmb-btn rmb-btn-success" onClick={handlePayment}>
                <i className="fas fa-lock"></i> Pay ₹{selectedBooking.totalAmount + selectedBooking.securityDeposit}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vehicle Documents Modal */}
      {showDocumentsModal && selectedBooking && (
        <div className="rmb-modal" onClick={() => setShowDocumentsModal(false)}>
          <div className="rmb-modal-content rmb-modal-large" onClick={(e) => e.stopPropagation()}>
            <span className="rmb-close" onClick={() => setShowDocumentsModal(false)}>&times;</span>
            <h3><i className="fas fa-file-pdf"></i> Vehicle Documents</h3>
            
            <div className="rmb-documents-grid">
              {selectedBooking.vehicleId?.documents?.rc && (
                <div className="rmb-document-item">
                  <h4><i className="fas fa-id-card"></i> RC (Registration Certificate)</h4>
                  <a 
                    href={`http://localhost:4000/uploads/${selectedBooking.vehicleId.documents.rc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rmb-btn rmb-btn-primary"
                  >
                    <i className="fas fa-eye"></i> View Document
                  </a>
                </div>
              )}
              
              {selectedBooking.vehicleId?.documents?.insurance && (
                <div className="rmb-document-item">
                  <h4><i className="fas fa-shield-alt"></i> Insurance</h4>
                  <a 
                    href={`http://localhost:4000/uploads/${selectedBooking.vehicleId.documents.insurance}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rmb-btn rmb-btn-primary"
                  >
                    <i className="fas fa-eye"></i> View Document
                  </a>
                </div>
              )}
              
              {selectedBooking.vehicleId?.documents?.pollution && (
                <div className="rmb-document-item">
                  <h4><i className="fas fa-leaf"></i> PUC (Pollution Certificate)</h4>
                  <a 
                    href={`http://localhost:4000/uploads/${selectedBooking.vehicleId.documents.pollution}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rmb-btn rmb-btn-primary"
                  >
                    <i className="fas fa-eye"></i> View Document
                  </a>
                </div>
              )}
            </div>
            
            <div className="rmb-modal-actions">
              <button className="rmb-btn rmb-btn-secondary" onClick={() => {
                setShowDocumentsModal(false);
                setShowDetailsModal(true);
              }}>
                <i className="fas fa-arrow-left"></i> Back to Details
              </button>
            </div>
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

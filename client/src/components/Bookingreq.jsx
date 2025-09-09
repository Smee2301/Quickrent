import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Bookingreq.css";

export default function Bookingreq() {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRenterPopup, setShowRenterPopup] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      const response = await fetch(`http://localhost:4000/api/bookings/owner/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookingRequests(data);
      }
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewRenterProfile = (renter) => {
    setSelectedRenter(renter);
    setShowRenterPopup(true);
  };

  const viewRenterDocuments = (documents) => {
    setSelectedDocuments(documents);
    setShowDocumentPopup(true);
  };

  const closeRenterPopup = () => {
    setShowRenterPopup(false);
    setSelectedRenter(null);
  };

  const closeDocumentPopup = () => {
    setShowDocumentPopup(false);
    setSelectedDocuments(null);
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const token = localStorage.getItem("qr_token");
      const response = await fetch(`http://localhost:4000/api/bookings/${bookingId}/${action}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} booking`);
      }

      setMessage(`✅ Booking ${action}ed successfully!`);
      fetchBookingRequests();
      
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="ob-page">
        <div className="ob-navbar">
          <img src="/logo1.png" alt="QuickRent Logo" />
          <h1>Owner Booking Requests</h1>
        </div>
        <div className="ob-container">
          <div className="loading">Loading booking requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ob-page">
      {/* Navbar */}
      <div className="ob-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" />
        <h1>Owner Booking Requests</h1>
      </div>

      {/* Content */}
      <div className="ob-co">
        <div className="ob-card">
          <div className="header-a">
            <h2>Booking Requests</h2>
            <button 
              className="btn-back"
              onClick={() => navigate("/owner/dashboard")}
            >
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {bookingRequests.length === 0 ? (
            <>
              <div className="no-bookings">
                <i className="fas fa-envelope-open"></i>
                <h3>No booking requests yet</h3>
                <p>When renters book your vehicles, their requests will appear here</p>
              </div>
              {/* Example bookings (demo) */}
              <div className="table-container" style={{ marginTop: 16 }}>
                <h4 style={{ margin: '8px 0' }}>Example Bookings (Demo)</h4>
                <table className="ob-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Renter</th>
                      <th>Pickup</th>
                      <th>Return</th>
                      <th>Duration</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example 1: Pending Booking */}
                    <tr>
                      <td>
                        <div className="vehicle-info">
                          <img src="/lv1.avif" alt="Hyundai i20" className="vehicle-thumbnail" />
                          <div>
                            <strong>Hyundai i20 Sportz</strong>
                            <small>GJ 01 AB 1234</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="renter-info">
                          <strong>Rahul Sharma</strong>
                          <small>+91 98765 43210</small>
                          <div className="renter-actions">
                            <button className="btn-view-profile" disabled>
                              <i className="fas fa-user"></i> Profile
                            </button>
                            <button className="btn-view-docs" disabled>
                              <i className="fas fa-file"></i> Docs
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>Dec 15, 2024</strong>
                          <small>10:00 AM</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Ahmedabad Airport</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>Dec 17, 2024</strong>
                          <small>06:00 PM</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Ahmedabad Airport</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="duration-info">
                          <strong>2 days 8 hours</strong>
                          <small>56 hours total</small>
                        </div>
                      </td>
                      <td>
                        <div className="amount-info">
                          <strong>{formatCurrency(3500)}</strong>
                          <small>Security: {formatCurrency(2000)}</small>
                          <small>Rate: ₹150/hour</small>
                        </div>
                      </td>
                      <td>{getStatusBadge('pending')}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="ob-btn ob-btn-approve" disabled>
                            <i className="fas fa-check"></i> Approve
                          </button>
                          <button className="ob-btn ob-btn-reject" disabled>
                            <i className="fas fa-times"></i> Reject
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Example 2: Approved Booking */}
                    <tr>
                      <td>
                        <div className="vehicle-info">
                          <img src="/lv2.webp" alt="Maruti Swift" className="vehicle-thumbnail" />
                          <div>
                            <strong>Maruti Swift VDI</strong>
                            <small>GJ 05 CD 5678</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="renter-info">
                          <strong>Priya Patel</strong>
                          <small>+91 87654 32109</small>
                          <div className="renter-actions">
                            <button className="btn-view-profile" disabled>
                              <i className="fas fa-user"></i> Profile
                            </button>
                            <button className="btn-view-docs" disabled>
                              <i className="fas fa-file"></i> Docs
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>Dec 20, 2024</strong>
                          <small>09:30 AM</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Vadodara Railway Station</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>Dec 22, 2024</strong>
                          <small>05:30 PM</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Vadodara Railway Station</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="duration-info">
                          <strong>2 days 8 hours</strong>
                          <small>56 hours total</small>
                        </div>
                      </td>
                      <td>
                        <div className="amount-info">
                          <strong>{formatCurrency(2800)}</strong>
                          <small>Security: {formatCurrency(1500)}</small>
                          <small>Rate: ₹100/hour</small>
                        </div>
                      </td>
                      <td>{getStatusBadge('approved')}</td>
                      <td>
                        <div className="action-buttons">
                          <span className="status-note">
                            <i className="fas fa-check-circle"></i> Ready for pickup
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Example 3: Completed Booking */}
                    <tr>
                      <td>
                        <div className="vehicle-info">
                          <img src="/vl3.jpg" alt="Honda City" className="vehicle-thumbnail" />
                          <div>
                            <strong>Honda City VX</strong>
                            <small>GJ 03 EF 9012</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="renter-info">
                          <strong>Amit Kumar</strong>
                          <small>+91 76543 21098</small>
                          <div className="renter-actions">
                            <button className="btn-view-profile" disabled>
                              <i className="fas fa-user"></i> Profile
                            </button>
                            <button className="btn-view-docs" disabled>
                              <i className="fas fa-file"></i> Docs
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>Dec 10, 2024</strong>
                          <small>08:00 AM</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Surat Central Mall</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>Dec 12, 2024</strong>
                          <small>07:00 PM</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Surat Central Mall</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="duration-info">
                          <strong>2 days 11 hours</strong>
                          <small>59 hours total</small>
                        </div>
                      </td>
                      <td>
                        <div className="amount-info">
                          <strong>{formatCurrency(4200)}</strong>
                          <small>Security: {formatCurrency(2500)}</small>
                          <small>Rate: ₹180/hour</small>
                        </div>
                      </td>
                      <td>{getStatusBadge('completed')}</td>
                      <td>
                        <div className="action-buttons">
                          <span className="status-note">
                            <i className="fas fa-star"></i> Trip completed
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="table-container">
              <table className="ob-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Renter</th>
                    <th>Pickup</th>
                    <th>Return</th>
                    <th>Duration</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="vehicle-info">
                          <img 
                            src={booking.vehicle?.photo ? `/uploads/${booking.vehicle.photo}` : '/lv1.avif'} 
                            alt={booking.vehicle?.brand}
                            className="vehicle-thumbnail"
                          />
                          <div>
                            <strong>{booking.vehicle?.brand} {booking.vehicle?.model}</strong>
                            <small>{booking.vehicle?.vehicleNumber}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="renter-info">
                          <strong>{booking.renter?.name}</strong>
                          <small>{booking.renter?.phone}</small>
                          <div className="renter-actions">
                            <button 
                              className="btn-view-profile"
                              onClick={() => viewRenterProfile(booking.renter)}
                            >
                              <i className="fas fa-user"></i> Profile
                            </button>
                            <button 
                              className="btn-view-docs"
                              onClick={() => viewRenterDocuments(booking.renter?.documents)}
                            >
                              <i className="fas fa-file"></i> Docs
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>{formatDate(booking.pickupDate)}</strong>
                          <small>{new Date(booking.pickupDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{booking.pickupLocation || 'Location not specified'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <strong>{formatDate(booking.returnDate)}</strong>
                          <small>{new Date(booking.returnDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</small>
                          <div className="location-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{booking.returnLocation || 'Location not specified'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="duration-info">
                          <strong>{booking.duration} {booking.durationUnit}</strong>
                          <small>{booking.totalHours || 'N/A'} hours total</small>
                        </div>
                      </td>
                      <td>
                        <div className="amount-info">
                          <strong>{formatCurrency(booking.totalAmount)}</strong>
                          <small>Security: {formatCurrency(booking.securityDeposit)}</small>
                          <small>Rate: ₹{booking.hourlyRate || 'N/A'}/hour</small>
                        </div>
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        {booking.status === 'pending' && (
                          <div className="action-buttons">
                            <button 
                              className="ob-btn ob-btn-approve"
                              onClick={() => handleBookingAction(booking._id, 'approve')}
                            >
                              <i className="fas fa-check"></i> Approve
                            </button>
                            <button 
                              className="ob-btn ob-btn-reject"
                              onClick={() => handleBookingAction(booking._id, 'reject')}
                            >
                              <i className="fas fa-times"></i> Reject
                            </button>
                          </div>
                        )}
                        {booking.status === 'approved' && (
                          <span className="status-note">Ready for pickup</span>
                        )}
                        {booking.status === 'rejected' && (
                          <span className="status-note">Request rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Popups remain same... */}
      {showRenterPopup && selectedRenter && (
        <div className="popup-overlay" onClick={closeRenterPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>
                <i className="fas fa-user"></i> Renter Profile
              </h3>
              <button className="popup-close" onClick={closeRenterPopup}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="popup-body">
              <div className="renter-profile">
                <div className="profile-image">
                  <img 
                    src={selectedRenter.profileImage || '/default-avatar.png'} 
                    alt={selectedRenter.name}
                  />
                </div>
                <div className="profile-details">
                  <h4>{selectedRenter.name}</h4>
                  <p><i className="fas fa-envelope"></i> {selectedRenter.email}</p>
                  <p><i className="fas fa-phone"></i> {selectedRenter.phone}</p>
                  <p><i className="fas fa-map-marker-alt"></i> {selectedRenter.city}</p>
                  <p><i className="fas fa-calendar"></i> Member since {formatDate(selectedRenter.createdAt)}</p>
                  
                  <div className="renter-stats">
                    <div className="stat">
                      <span className="stat-number">{selectedRenter.totalBookings || 0}</span>
                      <span className="stat-label">Total Bookings</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{selectedRenter.completedBookings || 0}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{selectedRenter.rating || 'N/A'}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn-primary" onClick={closeRenterPopup}>
                <i className="fas fa-check"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDocumentPopup && selectedDocuments && (
        <div className="popup-overlay" onClick={closeDocumentPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>
                <i className="fas fa-file-alt"></i> Renter Documents
              </h3>
              <button className="popup-close" onClick={closeDocumentPopup}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="popup-body">
              <div className="documents-list">
                {selectedDocuments.idProof && (
                  <div className="document-item">
                    <i className="fas fa-id-card"></i>
                    <span>ID Proof</span>
                    <a 
                      href={`/uploads/${selectedDocuments.idProof}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-view-doc"
                    >
                      <i className="fas fa-eye"></i> View
                    </a>
                  </div>
                )}
                {selectedDocuments.license && (
                  <div className="document-item">
                    <i className="fas fa-car"></i>
                    <span>Driving License</span>
                    <a 
                      href={`/uploads/${selectedDocuments.license}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-view-doc"
                    >
                      <i className="fas fa-eye"></i> View
                    </a>
                  </div>
                )}
                {selectedDocuments.addressProof && (
                  <div className="document-item">
                    <i className="fas fa-home"></i>
                    <span>Address Proof</span>
                    <a 
                      href={`/uploads/${selectedDocuments.addressProof}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-view-doc"
                    >
                      <i className="fas fa-eye"></i> View
                    </a>
                  </div>
                )}
                {Object.keys(selectedDocuments).length === 0 && (
                  <p className="no-documents">No documents uploaded by this renter.</p>
                )}
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn-primary" onClick={closeDocumentPopup}>
                <i className="fas fa-check"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

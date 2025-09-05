import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentHistory.css";

export default function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    totalCommission: 0,
    netEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      const response = await fetch(`http://localhost:4000/api/payments/owner/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data.payments || []);
        setSummary(data.summary || {
          totalEarnings: 0,
          totalCommission: 0,
          netEarnings: 0,
          pendingPayments: 0,
          completedPayments: 0
        });
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setMessage("❌ Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download PDF
  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("QuickRent - Payment History", 14, 20);
      doc.autoTable({ html: "#ph-paymentTable", startY: 30 });
      doc.save("payment-history.pdf");
    } catch (error) {
      setMessage("❌ Failed to download PDF");
    }
  };

  // ✅ Download Excel
  const downloadExcel = () => {
    try {
      const table = document.getElementById("ph-paymentTable");
      const wb = XLSX.utils.table_to_book(table, { sheet: "PaymentHistory" });
      XLSX.writeFile(wb, "payment-history.xlsx");
    } catch (error) {
      setMessage("❌ Failed to download Excel");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      'completed': 'status-completed',
      'pending': 'status-pending',
      'failed': 'status-failed',
      'refunded': 'status-refunded'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredPayments = paymentHistory.filter(payment => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  if (loading) {
    return (
      <div className="ph-wrapper">
        <div className="phnavbarr">
          <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
          <h1>QuickRent - Payment History</h1>
        </div>
        <div className="phcontainer">
          <div className="loading">Loading payment history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ph-wrapper">
      {/* Navbar */}
      <div className="phnavbarr">
        <img src="/logo1.png" alt="QuickRent Logo" className="logo" />
        <h1>QuickRent - Payment History</h1>
      </div>

      <div className="phcontainer">
        {/* Header Actions */}
        <div className="header-actions">
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

        {/* Summary Cards */}
        <div className="phsummary-cards">
          <div className="phcard earnings-card">
            <div className="card-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="card-content">
              <h3>Total Earnings</h3>
              <p className="amount">{formatCurrency(summary.totalEarnings)}</p>
              <small>Gross earnings from all bookings</small>
            </div>
          </div>
          
          <div className="phcard commission-card">
            <div className="card-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="card-content">
              <h3>Platform Commission</h3>
              <p className="amount commission">{formatCurrency(summary.totalCommission)}</p>
              <small>10% platform fee deducted</small>
            </div>
          </div>
          
          <div className="phcard net-card">
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="card-content">
              <h3>Net Earnings</h3>
              <p className="amount net">{formatCurrency(summary.netEarnings)}</p>
              <small>Amount credited to your account</small>
            </div>
          </div>
          
          <div className="phcard pending-card">
            <div className="card-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="card-content">
              <h3>Pending Payments</h3>
              <p className="amount pending">{formatCurrency(summary.pendingPayments)}</p>
              <small>Awaiting completion</small>
            </div>
          </div>
          
          <div className="phcard completed-card">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="card-content">
              <h3>Completed Payments</h3>
              <p className="amount completed">{formatCurrency(summary.completedPayments)}</p>
              <small>Successfully processed</small>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="phcontrols">
          <div className="filter-section">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select 
              id="status-filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div className="phdownload-buttons">
            <button onClick={downloadPDF} className="btn-download">
              <i className="fas fa-file-pdf"></i> Download PDF
            </button>
            <button onClick={downloadExcel} className="btn-download">
              <i className="fas fa-file-excel"></i> Download Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="phtable-container">
          {filteredPayments.length === 0 ? (
            <div className="no-payments">
              <i className="fas fa-receipt"></i>
              <h3>No payment records found</h3>
              <p>Payment history will appear here once you have completed bookings</p>
            </div>
          ) : (
            <table id="ph-paymentTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Booking ID</th>
                  <th>Vehicle</th>
                  <th>Renter</th>
                  <th>Gross Amount</th>
                  <th>Commission</th>
                  <th>Net Amount</th>
                  <th>Status</th>
                  <th>Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{formatDate(payment.date)}</td>
                    <td>
                      <span className="booking-id">#{payment.bookingId}</span>
                    </td>
                    <td>
                      <div className="vehicle-info">
                        <img 
                          src={payment.vehicle?.photo ? `/uploads/${payment.vehicle.photo}` : '/lv1.avif'} 
                          alt={payment.vehicle?.brand}
                          className="vehicle-thumbnail"
                        />
                        <div>
                          <strong>{payment.vehicle?.brand} {payment.vehicle?.model}</strong>
                          <small>{payment.vehicle?.vehicleNumber}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="renter-info">
                        <strong>{payment.renter?.name}</strong>
                        <small>{payment.renter?.phone}</small>
                      </div>
                    </td>
                    <td>
                      <span className="gross-amount">{formatCurrency(payment.grossAmount)}</span>
                    </td>
                    <td>
                      <span className="commission-amount">{formatCurrency(payment.commission)}</span>
                      <small>(10%)</small>
                    </td>
                    <td>
                      <span className="net-amount">{formatCurrency(payment.netAmount)}</span>
                    </td>
                    <td>{getStatusBadge(payment.status)}</td>
                    <td>
                      <span className="payment-mode">
                        <i className={`fas ${payment.paymentMode === 'UPI' ? 'fa-mobile-alt' : 'fa-university'}`}></i>
                        {payment.paymentMode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Commission Info */}
        <div className="commission-info">
          <div className="info-card">
            <h4><i className="fas fa-info-circle"></i> Commission Structure</h4>
            <div className="info-content">
              <p><strong>Platform Commission:</strong> 10% of gross booking amount</p>
              <p><strong>Net Earnings:</strong> 90% of gross booking amount</p>
              <p><strong>Payment Processing:</strong> Free for all transactions</p>
              <p><strong>Payout Schedule:</strong> Within 24-48 hours of booking completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

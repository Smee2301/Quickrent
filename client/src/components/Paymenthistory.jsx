import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
import "../styles/Paymenthistory.css";

export default function Paymenthistory() {
  const [filter, setFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { socket, connected } = useSocket();

  // Map booking -> payment transaction for owner
  const mapBookingToTransaction = (booking) => {
    const rawStatus = booking.status;
    let status = "Pending";
    if (rawStatus === "completed") status = "Completed";
    else if (["cancelled", "rejected"].includes(rawStatus)) status = "Cancelled";

    return {
      id: booking._id,
      date: booking.createdAt || booking.pickupDate,
      bookingId: booking._id,
      vehicle: booking.vehicleId
        ? `${booking.vehicleId.brand} ${booking.vehicleId.model}`
        : "Vehicle info not available",
      amount: booking.totalAmount,
      securityDeposit: booking.securityDeposit,
      status,              // payment status for UI/filter
      rawStatus,           // original booking status
      mode: booking.paymentMethod || "Online",
      renterName: booking.renterId?.name,
      renterPhone: booking.renterId?.phone,
      ownerName: booking.ownerId?.name,
      ownerPhone: booking.ownerId?.phone,
      ownerEmail: booking.ownerId?.email,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("qr_token");
        const user = JSON.parse(localStorage.getItem("qr_user") || "{}");

        if (!token || !user.id) {
          navigate("/owner/login", { replace: true });
          return;
        }

        const res = await fetch(`http://localhost:4000/api/bookings/owner/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load payment history");
        }

        const data = await res.json();
        if (cancelled) return;

        const mapped = (data || []).map(mapBookingToTransaction);
        // Latest first
        mapped.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(mapped);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching payment history:", err);
        setError(err.message || "Unable to fetch payment history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTransactions();

    if (socket && connected) {
      const refresh = () => fetchTransactions();
      // When new booking or cancellation happens, refresh owner view
      socket.on("new_booking_request", refresh);
      socket.on("booking_cancelled", refresh);

      return () => {
        cancelled = true;
        socket.off("new_booking_request", refresh);
        socket.off("booking_cancelled", refresh);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [socket, connected, navigate]);

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const filtered = useMemo(() => {
    if (filter === "All") return sorted;
    return sorted.filter((t) => t.status === filter);
  }, [sorted, filter]);

  const totalEarnings = useMemo(() => filtered
    .filter(t => t.status === "Completed")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0), [filtered]);

  const pendingPayments = useMemo(() => filtered
    .filter(t => t.status === "Pending")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0), [filtered]);

  const completedPayments = totalEarnings;

  const downloadPDF = () => {
    const jspdfNS = typeof window !== 'undefined' ? (window.jspdf || window.jsPDF || window.JSPDF) : undefined;
    const jsPDF = jspdfNS && (jspdfNS.jsPDF || jspdfNS);
    if (!jsPDF) {
      alert("PDF library not loaded. Please include jsPDF + autotable on the page.");
      return;
    }

    const doc = new jsPDF();
    if (doc && typeof doc.text === 'function') {
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      // Header info
      doc.text("QuickRent - Owner Payment History", 14, 20);
      if (user?.name) doc.text(`Owner: ${user.name}`, 14, 28);
      if (user?.email) doc.text(`Email: ${user.email}`, 14, 34);
      const generatedAt = new Date().toLocaleString('en-IN');
      doc.text(`Generated: ${generatedAt}`, 14, 40);

      if (typeof doc.autoTable === 'function') {
        // Build rows from current filtered transactions so PDF matches on-screen data
        const rows = filtered.map((t) => [
          new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          t.bookingId,
          t.vehicle,
          `₹${Number(t.amount || 0).toLocaleString('en-IN')}`,
          t.status,
          t.mode || 'Online',
        ]);

        doc.autoTable({
          head: [["Date", "Booking ID", "Vehicle", "Amount", "Status", "Mode"]],
          body: rows,
          startY: 46,
        });
      }
      doc.save("payment-history.pdf");
    }
  };

  const downloadExcel = () => {
    const XLSXLib = typeof window !== 'undefined' ? window.XLSX : undefined;
    if (!XLSXLib) {
      alert("Excel library not loaded. Please include SheetJS (XLSX) on the page.");
      return;
    }
    const table = document.getElementById("phpaymentTable");
    if (!table) return;
    const wb = XLSXLib.utils.table_to_book(table, { sheet: "PaymentHistory" });
    XLSXLib.writeFile(wb, "payment-history.xlsx");
  };

  if (loading) {
    return (
      <div className="PAY">
        <div className="phnavbarr">
          <img src="/logo1.png" alt="QuickRent Logo" className="phlogo" />
          <h1>QuickRent - Payment History</h1>
        </div>
        <div className="phcontainer">
          <h2>Owner Payment History</h2>
          <p>Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="PAY">
      {/* Navbar */}
      <div className="phnavbarr">
        <img src="/logo1.png" alt="QuickRent Logo" className="phlogo" />
        <h1>QuickRent - Payment History</h1>
      </div>

      <div className="phcontainer">
        <h2>Owner Payment History</h2>
        <button
          type="button"
          onClick={() => navigate('/owner/dashboard')}
          className="back-pymnt-btn"
          aria-label="Back to Owner Dashboard"
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>

        {error && (
          <p style={{ color: '#e74c3c', marginBottom: '10px' }}>{error}</p>
        )}

        {/* Summary Cards */}
        <div className="phsummary-cards">
          <div className="phcard">
            <h3>Total Earnings</h3>
            <p>₹{totalEarnings.toLocaleString('en-IN')}</p>
          </div>
          <div className="phcard">
            <h3>Pending Payments</h3>
            <p>₹{pendingPayments.toLocaleString('en-IN')}</p>
          </div>
          <div className="phcard">
            <h3>Completed Payments</h3>
            <p>₹{completedPayments.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="phcontrols">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Payments</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="phdownload-buttons">
            <button onClick={downloadPDF}>Download PDF</button>
            {/* <button onClick={downloadExcel}>Download Excel</button> */}
          </div>
        </div>

        {/* Table */}
        <div className="phtable-container">
          {filtered.length === 0 ? (
            <p>No payment records found yet.</p>
          ) : (
            <table id="phpaymentTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Booking ID</th>
                  <th>Vehicle</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const d = new Date(t.date);
                  const displayDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                  return (
                    <tr key={t.bookingId}>
                      <td>{displayDate}</td>
                      <td>{t.bookingId}</td>
                      <td>{t.vehicle}</td>
                      <td>₹{Number(t.amount || 0).toLocaleString('en-IN')}</td>
                      <td>{t.status}</td>
                      <td>{t.mode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

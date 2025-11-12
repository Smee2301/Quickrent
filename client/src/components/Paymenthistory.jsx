import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Paymenthistory.css";

export default function Paymenthistory() {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  // In production, replace with fetched transactions for the logged-in owner
  const transactions = useMemo(() => {
    return [
      { date: "2025-08-15", bookingId: "B001", vehicle: "Hyundai i20", amount: 3500, status: "Completed", mode: "Bank Transfer" },
      { date: "2025-08-12", bookingId: "B002", vehicle: "Honda Activa", amount: 1200, status: "Pending", mode: "UPI" },
      { date: "2025-08-05", bookingId: "B003", vehicle: "Toyota Innova", amount: 5000, status: "Completed", mode: "Bank Transfer" }
    ];
  }, []);

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const filtered = useMemo(() => {
    if (filter === "All") return sorted;
    return sorted.filter((t) => t.status === filter);
  }, [sorted, filter]);

  const totalEarnings = useMemo(() => transactions
    .filter(t => t.status === "Completed")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0), [transactions]);

  const pendingPayments = useMemo(() => transactions
    .filter(t => t.status === "Pending")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0), [transactions]);

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
      doc.text("QuickRent - Payment History", 14, 20);
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({ html: "#phpaymentTable", startY: 30 });
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
          className="back-dashboard-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            margin: '8px 0 16px',
            background: '#0ea5e9',
            color: '#fff',
            border: 'none',
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          aria-label="Back to Owner Dashboard"
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>

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
          </select>
          <div className="phdownload-buttons">
            <button onClick={downloadPDF}>Download PDF</button>
            <button onClick={downloadExcel}>Download Excel</button>
          </div>
        </div>

        {/* Table */}
        <div className="phtable-container">
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
                    <td>#{t.bookingId}</td>
                    <td>{t.vehicle}</td>
                    <td>₹{Number(t.amount || 0).toLocaleString('en-IN')}</td>
                    <td>{t.status}</td>
                    <td>{t.mode}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

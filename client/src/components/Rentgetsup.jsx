import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rentgetsup.css";
import "../styles/SharedButtons.css";
import logo from "../logo1.png";

export default function Rentgetsup() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [form, setForm] = useState({ name: "", email: "", bookingId: "", issue: "", description: "" });

  function onSearch() {
    const q = query.trim().toLowerCase();
    if (!q) { setResult(""); return; }
    if (q.includes("payment")) setResult("Payments can take up to 24 hours to reflect. If delayed beyond 24h, share your Booking ID and UTR to support.");
    else if (q.includes("refund")) setResult("Refunds take 5–7 business days. If not received after 7 days, contact support with your transaction ref.");
    else if (q.includes("booking")) setResult("Check Dashboard → My Bookings. If you cannot see it, ensure KYC is verified and try again.");
    else if (q.includes("kyc") || q.includes("otp")) setResult("Complete KYC in Verify Identity: Aadhaar/PAN + DOB + OTP. Age must be 18+.");
    else setResult("No direct match. Try Contact Support or Raise a Ticket below.");
  }

  function update(field) {
    return (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    // Simulate submit
    alert("✅ Support request submitted. We will contact you at " + form.email + ".");
    setForm({ name: "", email: "", bookingId: "", issue: "", description: "" });
  }
  return (
    <div className="qsupport-body">
      {/* Navbar */}
      <div className="qsupport-navbar">
        <div className="qsupport-nav-left">
          <img src={logo} alt="QuickRent Logo" className="qsupport-logo" />
        </div>
        <h1>QuickRent - Support</h1>
      </div>

      {/* Hero Search */}
      <div className="qsupport-hero">
        <button 
          type="button" 
          onClick={() => navigate('/renter/dashboard')}
          className="back-to-dashboard-btn"
          aria-label="Back to Renter Dashboard"
          style={{marginBottom: '20px'}}
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        
        <h2>Need Help? How can we assist you today?</h2>
        <div className="qsupport-searchbox">
          <input type="text" placeholder="Search FAQs, Booking ID, issues..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button onClick={onSearch}>🔍</button>
        </div>
        {result && <div className="qsupport-result">{result}</div>}
      </div>

      {/* Quick Action Links */}
      <div className="qsupport-links">
        <div className="qsupport-link">
          <span>❓</span>
          <h3>FAQs</h3>
          <p>Frequently asked questions</p>
        </div>
        <div className="qsupport-link">
          <span>🎧</span>
          <h3>Contact Support</h3>
          <p>Email or call support team</p>
        </div>
        <div className="qsupport-link">
          <span>💬</span>
          <h3>Live Chat</h3>
          <p>Chat with a support agent</p>
        </div>
        <div className="qsupport-link">
          <span>🎫</span>
          <h3>Raise a Ticket</h3>
          <p>Submit your issue</p>
        </div>
      </div>

      {/* Support Form */}
      <div className="qsupport-form">
        <h3>
          <span>📧</span> Submit a Support Request
        </h3>
        <form onSubmit={submit}>
          <div className="qsupport-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required value={form.name} onChange={update('name')} />
          </div>
          <div className="qsupport-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required value={form.email} onChange={update('email')} />
          </div>
          <div className="qsupport-group">
            <label>Booking ID (if applicable)</label>
            <input type="text" placeholder="Enter Booking ID" value={form.bookingId} onChange={update('bookingId')} />
          </div>
          <div className="qsupport-group">
            <label>Issue Type</label>
            <select required value={form.issue} onChange={update('issue')}>
              <option value="">-- Select Issue --</option>
              <option>Payment Issue</option>
              <option>Booking Issue</option>
              <option>Vehicle Issue</option>
              <option>Account Issue</option>
              <option>Other</option>
            </select>
          </div>
          <div className="qsupport-group">
            <label>Describe Your Issue</label>
            <textarea placeholder="Provide details of your problem" value={form.description} onChange={update('description')}></textarea>
          </div>
          <div className="qsupport-actions">
            <button type="submit">Submit Now</button>
          </div>
        </form>
      </div>
    </div>
  );
}
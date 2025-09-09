import React, { useState } from "react";
import "../styles/ChatWidget.css";

export default function ChatWidget({ role = "renter" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: `Hi ${role === "owner" ? "Owner" : "Renter"} 👋! How can we help you today?` }
  ]);
  const [input, setInput] = useState("");

  // Knowledge base (expandable)
  const faq = {
    renter: {
      booking: "If you face booking issues, try refreshing, ensure KYC is verified, or re-attempt from Dashboard → My Bookings.",
      payment: "Payments are secure. If a payment is pending, give it up to 24 hours or contact support with your Booking ID.",
      refund: "Refunds take 5–7 business days. If not received after 7 days, share transaction reference for escalation.",
      kyc: "Complete KYC in Profile → Verify ID. Enter Aadhaar/PAN, verify OTP, and ensure you're 18+.",
      documents: "Upload your license and ID in Profile → Documents. Ensure files are JPG/PNG/PDF under 5MB.",
      support: "For urgent help, provide Booking ID, vehicle number, and issue summary for faster resolution.",
    },
    owner: {
      add: "To add a vehicle, Dashboard → Add Vehicle. Provide photos, RC, insurance, and set pricing.",
      earnings: "Track earnings in Dashboard → Payment History. Completed bookings add to total earnings.",
      commission: "We charge a small fee per successful booking, visible in each transaction.",
      security: "Check per-vehicle security in Vehicle Security. Uploaded RC/Insurance/Pollution impact compliance.",
      bookings: "Owner Booking Requests shows all requests. Approve/reject and view renter KYC/docs there.",
      tips: "Better photos, accurate pricing, and clear pickup/return rules improve booking conversion.",
    }
  };

  function toggle() {
    setIsOpen(!isOpen);
  }

  function handleSend(e, textOverride) {
    if (e) e.preventDefault();
    const trimmed = (textOverride || input).trim();
    if (!trimmed) return;

    const next = [...messages, { role: "user", text: trimmed }];

    // Match FAQ reply with keyword detection
    let botReply = "Thanks! Our team will reach out shortly.";
    const lower = trimmed.toLowerCase();

    Object.entries(faq[role]).forEach(([key, value]) => {
      if (lower.includes(key)) botReply = value;
    });

    // Add advanced contextual hints
    if (role === 'owner' && lower.includes('no bookings')) {
      botReply = "Try improving listing photos, competitive pricing, and share your listing link. Also verify documents for higher trust.";
    }
    if (role === 'renter' && lower.includes('not eligible')) {
      botReply = "Ensure you're 18+, KYC verified (Aadhaar/PAN + OTP), and license uploaded/valid.";
    }

    setMessages([...next, { role: "bot", text: botReply }]);
    setInput("");
  }

  return (
    <div className={`chat-widget ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            {role === "owner" ? "Owner Support" : "Renter Support"}
          </div>

          <div className="chat-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`msg ${m.role}`}>{m.text}</div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="chat-quick">
            {role === "renter" && (
              <>
                <button onClick={(e) => handleSend(e, "Booking issue")}>Booking Issue</button>
                <button onClick={(e) => handleSend(e, "KYC")}>KYC</button>
                <button onClick={(e) => handleSend(e, "Payment issue")}>Payment</button>
                <button onClick={(e) => handleSend(e, "Refund status")}>Refund</button>
              </>
            )}
            {role === "owner" && (
              <>
                <button onClick={(e) => handleSend(e, "Add vehicle")}>Add Vehicle</button>
                <button onClick={(e) => handleSend(e, "Earnings")}>Earnings</button>
                <button onClick={(e) => handleSend(e, "Bookings")}>Bookings</button>
                <button onClick={(e) => handleSend(e, "Security")}>Security</button>
                <button onClick={(e) => handleSend(e, "Commission")}>Commission Fee</button>
              </>
            )}
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <button className="chat-toggle" onClick={toggle}>
        {isOpen ? "×" : "💬 Chat"}
      </button>
    </div>
  );
}

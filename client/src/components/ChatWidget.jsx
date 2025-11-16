import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatWidget.css";

export default function ChatWidget({ role = "renter" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("home"); // home, chat, contact, faq
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = {
        role: "bot",
        text: `Hi ${role === "owner" ? "Owner" : "Renter"}! 👋 Welcome to QuickRent Support. How can I assist you today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, role]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate unread messages when closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "bot") {
        setUnreadCount(prev => prev + 1);
      }
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  // Enhanced knowledge base
  const faq = {
    renter: [
      {
        question: "How do I book a vehicle?",
        answer: "Go to Browse Vehicles, select your vehicle, choose dates/times, and click Book Now. Ensure your KYC is verified first.",
        keywords: ["book", "booking", "reserve", "rent"]
      },
      {
        question: "Payment issues or delays",
        answer: "Payments are secure and processed instantly. If pending, wait up to 24 hours. For issues, contact support with your Booking ID and transaction reference.",
        keywords: ["payment", "pay", "transaction", "pending"]
      },
      {
        question: "How do refunds work?",
        answer: "Refunds take 5-7 business days to process. Cancellation policies vary by owner. Check your booking details for specific terms.",
        keywords: ["refund", "cancel", "money back"]
      },
      {
        question: "KYC verification process",
        answer: "Complete KYC in Profile → Verify Identity. Provide Aadhaar/PAN, verify OTP, upload driving license. You must be 18+ to rent.",
        keywords: ["kyc", "verify", "identity", "aadhaar", "pan", "otp"]
      },
      {
        question: "Document upload guidelines",
        answer: "Upload clear images of your driving license and address proof. Accepted formats: JPG, PNG, PDF (max 5MB). Ensure documents are valid and readable.",
        keywords: ["document", "upload", "license", "id"]
      },
      {
        question: "Can't find my booking",
        answer: "Check Dashboard → My Bookings. If missing, ensure KYC is verified and payment was successful. Contact support with your transaction details.",
        keywords: ["missing", "lost", "can't find", "where"]
      }
    ],
    owner: [
      {
        question: "How to list a vehicle",
        answer: "Go to Dashboard → Add Vehicle. Upload clear photos, provide vehicle details, RC, insurance, PUC, and set competitive pricing.",
        keywords: ["add", "list", "vehicle", "car"]
      },
      {
        question: "Track earnings and payments",
        answer: "View earnings in Dashboard → Payment History. Completed bookings automatically add to your balance. Withdrawals available after 48 hours.",
        keywords: ["earnings", "payment", "money", "balance"]
      },
      {
        question: "Commission and fees",
        answer: "We charge a small service fee per successful booking (10-15%). Transparent pricing shown in each transaction. No hidden charges.",
        keywords: ["commission", "fee", "charge", "cost"]
      },
      {
        question: "Vehicle security and documents",
        answer: "Upload RC, Insurance, and PUC in Vehicle Security. Valid documents increase trust and booking rates. Update before expiry.",
        keywords: ["security", "document", "rc", "insurance", "puc"]
      },
      {
        question: "Managing booking requests",
        answer: "Check Booking Requests for all pending requests. View renter KYC, documents, and ratings. Approve/reject within 24 hours for best results.",
        keywords: ["booking", "request", "approve", "reject"]
      },
      {
        question: "Tips for more bookings",
        answer: "Use high-quality photos, competitive pricing, accurate descriptions, and respond quickly. Keep documents updated and maintain 24/7 availability.",
        keywords: ["tips", "more bookings", "increase", "improve"]
      }
    ]
  };

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setView("home");
    }
  };

  const handleSend = (e, textOverride) => {
    if (e) e.preventDefault();
    const trimmed = (textOverride || input).trim();
    if (!trimmed) return;

    const userMsg = {
      role: "user",
      text: trimmed,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botReply = generateBotReply(trimmed);
      const botMsg = {
        role: "bot",
        text: botReply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotReply = (userInput) => {
    const lower = userInput.toLowerCase();
    
    // Check FAQ for matching keywords
    for (const item of faq[role]) {
      if (item.keywords.some(keyword => lower.includes(keyword))) {
        return item.answer;
      }
    }

    // Contextual responses
    if (lower.includes('talk') || lower.includes('speak') || lower.includes('agent') || lower.includes('human')) {
      return "I can connect you with a live agent! Please use the 'Contact Support' option from the menu, or call us at +91-1800-QUICKRENT (24/7 available).";
    }

    if (lower.includes('urgent') || lower.includes('emergency')) {
      return "⚠️ For urgent issues, please call our 24/7 helpline: +91-1800-QUICKRENT or email support@quickrent.com. Average response time: 5 minutes.";
    }

    // Default helpful response
    return "I understand you need help with that. Could you provide more details? Or select a topic from the menu above, or use 'Contact Support' to reach our team directly. We're here 24/7!";
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    // In production, this would send to backend API
    console.log('Contact form submitted:', contactForm);
    
    alert(`✅ Thank you ${contactForm.name}! Your message has been received.\n\nOur support team will respond to ${contactForm.email} within 2-4 hours.\n\nTicket ID: #QR${Date.now().toString().slice(-6)}`);
    
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" });
    setView("home");
  };

  const handleQuickAction = (action) => {
    handleSend(null, action);
    setView("chat");
  };

  // Render different views
  const renderView = () => {
    switch(view) {
      case "home":
        return renderHome();
      case "chat":
        return renderChat();
      case "contact":
        return renderContact();
      case "faq":
        return renderFAQ();
      default:
        return renderHome();
    }
  };

  const renderHome = () => (
    <div className="chat-home">
      <div className="chat-welcome">
        <div className="chat-welcome-icon">👋</div>
        <h3>Welcome to QuickRent Support</h3>
        <p>How can we help you today?</p>
      </div>

      <div className="chat-options">
        <button className="chat-option" onClick={() => setView("chat")}>
          <div className="option-icon">💬</div>
          <div className="option-content">
            <h4>Chat with AI Assistant</h4>
            <p>Get instant answers 24/7</p>
          </div>
          <i className="fas fa-chevron-right"></i>
        </button>

        <button className="chat-option" onClick={() => setView("contact")}>
          <div className="option-icon">📧</div>
          <div className="option-content">
            <h4>Contact Support Team</h4>
            <p>Submit a ticket or inquiry</p>
          </div>
          <i className="fas fa-chevron-right"></i>
        </button>

        <button className="chat-option" onClick={() => setView("faq")}>
          <div className="option-icon">❓</div>
          <div className="option-content">
            <h4>Browse FAQs</h4>
            <p>Find answers to common questions</p>
          </div>
          <i className="fas fa-chevron-right"></i>
        </button>

        <a href="tel:+911800QUICKRENT" className="chat-option">
          <div className="option-icon">📞</div>
          <div className="option-content">
            <h4>Call Us</h4>
            <p>+91-1800-QUICKRENT (24/7)</p>
          </div>
          <i className="fas fa-chevron-right"></i>
        </a>
      </div>

      <div className="chat-footer-info">
        <div className="support-badge">
          <span className="status-dot"></span>
          <span>Support Online • Avg response: 2 min</span>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="chat-conversation">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.role}`}>
            <div className="message-avatar">
              {msg.role === "bot" ? "🤖" : "👤"}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message message-bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-quick-replies">
        {role === "renter" && (
          <>
            <button onClick={() => handleQuickAction("How do I book a vehicle?")}>Booking</button>
            <button onClick={() => handleQuickAction("KYC verification")}>KYC</button>
            <button onClick={() => handleQuickAction("Payment issue")}>Payment</button>
            <button onClick={() => handleQuickAction("Refund status")}>Refund</button>
          </>
        )}
        {role === "owner" && (
          <>
            <button onClick={() => handleQuickAction("How to list a vehicle")}>Add Vehicle</button>
            <button onClick={() => handleQuickAction("Track earnings")}>Earnings</button>
            <button onClick={() => handleQuickAction("Booking requests")}>Bookings</button>
            <button onClick={() => handleQuickAction("Commission")}>Fees</button>
          </>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input-field"
        />
        <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );

  const renderContact = () => (
    <div className="chat-contact">
      <div className="contact-header">
        <div className="contact-icon">📧</div>
        <h3>Contact Support Team</h3>
        <p>We'll respond within 2-4 hours</p>
      </div>

      <form onSubmit={handleContactSubmit} className="contact-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            required
            value={contactForm.name}
            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            required
            value={contactForm.email}
            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label>Subject *</label>
          <select
            required
            value={contactForm.subject}
            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
          >
            <option value="">Select a subject</option>
            {role === "renter" ? (
              <>
                <option value="booking">Booking Issues</option>
                <option value="payment">Payment & Refunds</option>
                <option value="kyc">KYC Verification</option>
                <option value="vehicle">Vehicle Issues</option>
                <option value="other">Other</option>
              </>
            ) : (
              <>
                <option value="listing">Vehicle Listing</option>
                <option value="earnings">Earnings & Payouts</option>
                <option value="booking">Booking Requests</option>
                <option value="documents">Document Verification</option>
                <option value="other">Other</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea
            required
            rows="4"
            value={contactForm.message}
            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
            placeholder="Describe your issue in detail..."
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          <i className="fas fa-paper-plane"></i> Submit Ticket
        </button>
      </form>

      <div className="contact-alternatives">
        <p>Need immediate help?</p>
        <div className="alt-contact">
          <a href="tel:+911800QUICKRENT"><i className="fas fa-phone"></i> +91-1800-QUICKRENT</a>
          <a href="mailto:support@quickrent.com"><i className="fas fa-envelope"></i> support@quickrent.com</a>
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="chat-faq">
      <div className="faq-header">
        <div className="faq-icon">❓</div>
        <h3>Frequently Asked Questions</h3>
        <p>Find quick answers below</p>
      </div>

      <div className="faq-list">
        {faq[role].map((item, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-question">
              <i className="fas fa-question-circle"></i>
              {item.question}
            </div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <p>Didn't find what you're looking for?</p>
        <button onClick={() => setView("contact")} className="faq-contact-btn">
          Contact Support Team
        </button>
      </div>
    </div>
  );

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            {view !== "home" && (
              <button className="back-btn" onClick={() => setView("home")}>
                <i className="fas fa-arrow-left"></i>
              </button>
            )}
            <div className="header-content">
              <div className="header-title">
                <span className="header-icon">⚡</span>
                {role === "owner" ? "Owner Support" : "Renter Support"}
              </div>
              <div className="header-subtitle">QuickRent Help Center</div>
            </div>
            <button className="close-btn" onClick={toggle}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-body">
            {renderView()}
          </div>
        </div>
      )}
      
      <button className="chat-toggle" onClick={toggle}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-comments"></i>
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </>
        )}
      </button>
    </div>
  );
}

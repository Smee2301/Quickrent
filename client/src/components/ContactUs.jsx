import React, { useState } from 'react';
import '../styles/ContactUs.css';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      userType: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p className="contact-hero-subtitle">
            Get in touch with our team for support, questions, or feedback
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-container">
        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions about QuickRent? We're here to help! Reach out to us through any of the channels below.
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon"><i className="fas fa-phone"></i></div>
                <div className="contact-details">
                  <h3>Phone Support</h3>
                  <p>+91 98765 43210</p>
                  <small>Mon-Fri: 9 AM - 6 PM</small>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                <div className="contact-details">
                  <h3>Email Support</h3>
                  <p>support@quickrent.com</p>
                  <small>24/7 Email Support</small>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="contact-details">
                  <h3>Office Address</h3>
                  <p>123 Business Park, Sector 5<br />Gandhinagar, Gujarat 382010</p>
                  <small>Visit us Mon-Fri: 10 AM - 5 PM</small>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon"><i className="fas fa-comments"></i></div>
                <div className="contact-details">
                  <h3>Live Chat</h3>
                  <p>Available on our website</p>
                  <small>24/7 Live Chat Support</small>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              <h3>Quick Links</h3>
              <div className="links-grid">
                <a href="/how-it-works" className="quick-link"><i className="fas fa-question-circle"></i> How It Works</a>
                <a href="/about" className="quick-link"><i className="fas fa-info-circle"></i> About Us</a>
                <a href="/terms" className="quick-link"><i className="fas fa-file-contract"></i> Terms & Conditions</a>
                <a href="/support" className="quick-link"><i className="fas fa-headset"></i> Help Center</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter your email address" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" />
              </div>

              <div className="form-group">
                <label htmlFor="userType">I am a *</label>
                <select id="userType" name="userType" value={formData.userType} onChange={handleInputChange} required>
                  <option value="">Select your role</option>
                  <option value="owner">Vehicle Owner</option>
                  <option value="renter">Renter</option>
                  <option value="potential-owner">Potential Owner</option>
                  <option value="potential-renter">Potential Renter</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="booking">Booking Issues</option>
                  <option value="vehicle">Vehicle Listing</option>
                  <option value="safety">Safety & Security</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows="5" placeholder="Please describe your inquiry in detail..."></textarea>
              </div>

              <button type="submit" className="submit-btn"><i className="fas fa-paper-plane"></i> Send Message</button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item"><h4>How quickly do you respond to inquiries?</h4><p>We typically respond to all inquiries within 24 hours. For urgent matters, please call our support line.</p></div>
            <div className="faq-item"><h4>Do you offer phone support?</h4><p>Yes, we offer phone support Monday through Friday from 9 AM to 6 PM. You can reach us at +91 98765 43210.</p></div>
            <div className="faq-item"><h4>Can I visit your office?</h4><p>Absolutely! Our office is open Monday through Friday from 10 AM to 5 PM. Please call ahead to schedule a visit.</p></div>
            <div className="faq-item"><h4>What if I have a technical issue?</h4><p>For technical issues, please use our live chat feature or email support@quickrent.com for immediate assistance.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

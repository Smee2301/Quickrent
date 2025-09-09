import React from 'react';
import '../styles/About.css';

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About QuickRent</h1>
          <p className="about-hero-subtitle">
            Revolutionizing vehicle rental with a peer-to-peer platform that connects vehicle owners with renters
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* Mission Section */}
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            QuickRent is dedicated to creating a seamless, secure, and efficient vehicle rental ecosystem. 
            We believe in empowering both vehicle owners to monetize their assets and renters to access 
            affordable transportation solutions.
          </p>
        </div>

        {/* For Owners Section */}
        <div className="about-section">
          <h2>For Vehicle Owners</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-rupee-sign"></i>
              </div>
              <h3>Earn Money</h3>
              <p>Turn your idle vehicle into a source of income. Set your own rental rates and availability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Platform</h3>
              <p>Comprehensive insurance coverage and verified renter profiles ensure your vehicle's safety.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Track your earnings, booking history, and vehicle performance with detailed analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Maintenance Tracking</h3>
              <p>Keep track of your vehicle's maintenance schedule and service history.</p>
            </div>
          </div>
        </div>

        {/* For Renters Section */}
        <div className="about-section">
          <h2>For Renters</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Easy Discovery</h3>
              <p>Find the perfect vehicle for your needs with our advanced search and filter options.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Simple Booking</h3>
              <p>Book your vehicle in just a few clicks with our user-friendly interface.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Quality Assurance</h3>
              <p>All vehicles are verified and maintained to ensure a safe and comfortable ride.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support to assist you with any queries or issues.</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="about-section">
          <h2>Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Verified user profiles with KYC documentation</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Real-time GPS tracking and vehicle monitoring</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Secure payment processing with multiple options</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Comprehensive insurance coverage for all rentals</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Instant booking confirmation and notifications</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Rating and review system for transparency</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="about-section stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Vehicles Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Successful Rentals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="about-section">
          <h2>Our Team</h2>
          <p>
            QuickRent is built by a passionate team of developers, designers, and business professionals 
            who are committed to revolutionizing the vehicle rental industry. We combine technical expertise 
            with deep understanding of user needs to create the best possible experience for both owners and renters.
          </p>
        </div>
      </div>
    </div>
  );
}

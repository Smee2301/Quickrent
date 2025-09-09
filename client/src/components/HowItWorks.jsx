import React from 'react';
import '../styles/HowItWorks.css';

export default function HowItWorks() {
  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <div className="how-hero">
        <div className="how-hero-content">
          <h1>How QuickRent Works</h1>
          <p className="how-hero-subtitle">
            Simple steps to start earning as an owner or renting as a user
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="how-container">
        {/* For Vehicle Owners */}
        <div className="how-section">
          <h2>For Vehicle Owners</h2>
          <p className="section-subtitle">
            Turn your idle vehicle into a source of income in just a few simple steps
          </p>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up & Verify</h3>
                <p>Create your owner account and complete the verification process with your documents (Aadhaar, PAN, Driving License).</p>
                <ul>
                  <li>Upload required documents</li>
                  <li>Complete KYC verification</li>
                  <li>Set up your profile</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>List Your Vehicle</h3>
                <p>Add your vehicle details including photos, specifications, and set your rental rates and availability.</p>
                <ul>
                  <li>Upload vehicle photos</li>
                  <li>Add vehicle specifications</li>
                  <li>Set hourly/daily rates</li>
                  <li>Define availability schedule</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Receive Booking Requests</h3>
                <p>Get notified when renters want to book your vehicle. Review their profile and documents before approving.</p>
                <ul>
                  <li>Review renter profiles</li>
                  <li>Check booking details</li>
                  <li>Approve or reject requests</li>
                  <li>Set pickup/return locations</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Earn Money</h3>
                <p>Once the rental is completed, receive your earnings directly to your bank account with detailed analytics.</p>
                <ul>
                  <li>Track earnings in real-time</li>
                  <li>View detailed analytics</li>
                  <li>Manage maintenance records</li>
                  <li>Get customer feedback</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* For Renters */}
        <div className="how-section">
          <h2>For Renters</h2>
          <p className="section-subtitle">
            Find and book the perfect vehicle for your needs in minutes
          </p>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Sign up as a renter and complete your profile with necessary documents for verification.</p>
                <ul>
                  <li>Upload ID proof</li>
                  <li>Add driving license</li>
                  <li>Complete profile setup</li>
                  <li>Verify phone number</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Search & Filter</h3>
                <p>Use our advanced search to find vehicles based on location, type, price, and availability.</p>
                <ul>
                  <li>Search by location</li>
                  <li>Filter by vehicle type</li>
                  <li>Compare prices</li>
                  <li>Check availability</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Book & Pay</h3>
                <p>Select your preferred vehicle, choose pickup/return times, and make secure payment.</p>
                <ul>
                  <li>Select pickup/return times</li>
                  <li>Choose pickup location</li>
                  <li>Make secure payment</li>
                  <li>Get instant confirmation</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Enjoy Your Ride</h3>
                <p>Pick up your vehicle and enjoy your journey. Return it on time and rate your experience.</p>
                <ul>
                  <li>Pick up vehicle</li>
                  <li>Enjoy your trip</li>
                  <li>Return on time</li>
                  <li>Rate your experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Security */}
        <div className="how-section safety-section">
          <h2>Safety & Security</h2>
          <div className="safety-grid">
            <div className="safety-item">
              <div className="safety-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Verified Users</h3>
              <p>All users go through comprehensive verification including KYC documents and phone verification.</p>
            </div>
            <div className="safety-item">
              <div className="safety-icon">
                <i className="fas fa-car-crash"></i>
              </div>
              <h3>Insurance Coverage</h3>
              <p>Comprehensive insurance coverage for all rentals to protect both owners and renters.</p>
            </div>
            <div className="safety-item">
              <div className="safety-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>GPS Tracking</h3>
              <p>Real-time GPS tracking and monitoring for enhanced security and peace of mind.</p>
            </div>
            <div className="safety-item">
              <div className="safety-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Secure Payments</h3>
              <p>Secure payment processing with multiple payment options and fraud protection.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="how-section faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How much can I earn as a vehicle owner?</h4>
              <p>Earnings depend on your vehicle type, location, and availability. On average, owners earn ₹500-2000 per day depending on the vehicle.</p>
            </div>
            <div className="faq-item">
              <h4>What documents do I need to rent a vehicle?</h4>
              <p>You need a valid driving license, ID proof (Aadhaar/PAN), and a verified phone number to rent vehicles on our platform.</p>
            </div>
            <div className="faq-item">
              <h4>Is there insurance coverage?</h4>
              <p>Yes, all rentals are covered under comprehensive insurance. Both owners and renters are protected during the rental period.</p>
            </div>
            <div className="faq-item">
              <h4>How do I cancel a booking?</h4>
              <p>You can cancel bookings through the app. Cancellation policies vary based on timing - check the specific terms for your booking.</p>
            </div>
            <div className="faq-item">
              <h4>What if there's damage to the vehicle?</h4>
              <p>Any damages are covered under insurance. The process is handled through our support team with proper documentation.</p>
            </div>
            <div className="faq-item">
              <h4>How do I get paid as an owner?</h4>
              <p>Payments are processed automatically after each successful rental and transferred to your registered bank account within 24-48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Terms.css';

export default function Terms() {
  return (
    <div className="terms-container">
      <div className="terms-hero">
        <h1>Terms and Conditions</h1>
      </div>

      <div className="terms-content">
        {/* 1. Overview */}
        <section>
          <h2>1. Overview</h2>
          <p>
            QuickRent is a marketplace platform connecting vehicle owners ("Owner") with renters ("Renter").
            By using our platform, you agree to these Terms and our policies. These Terms form a binding
            agreement between you and QuickRent.
          </p>
        </section>

        {/* 2. Definitions */}
        <section>
          <h2>2. Definitions</h2>
          <ul>
            <li><strong>Owner</strong>: User who lists vehicles for rent.</li>
            <li><strong>Renter</strong>: User who books vehicles listed by Owners.</li>
            <li><strong>Platform Fee</strong>: Service fee charged by QuickRent on each successful transaction.</li>
            <li><strong>Booking</strong>: A confirmed rental request between a Renter and an Owner.</li>
          </ul>
        </section>

        {/* 3. Eligibility */}
        <section>
          <h2>3. Eligibility & Verification</h2>
          <ul>
            <li>Users must be at least 18 years old and legally capable of entering contracts.</li>
            <li>Renters must hold a valid driving license and meet any local legal requirements.</li>
            <li>We may require identity and document verification for both Owners and Renters.</li>
          </ul>
        </section>

        {/* 4. Owner Obligations */}
        <section>
          <h2>4. Owner Obligations</h2>
          <ul>
            <li>List only vehicles you own or are legally authorized to rent out.</li>
            <li>Ensure vehicles are roadworthy, insured (as required by law), and regularly maintained.</li>
            <li>Provide accurate information (photos, documents, pricing, availability) and disclose any known issues.</li>
            <li>Deliver/hand over the vehicle in clean, safe condition with proper documentation.</li>
          </ul>
        </section>

        {/* 5. Renter Obligations */}
        <section>
          <h2>5. Renter Obligations</h2>
          <ul>
            <li>Use the vehicle lawfully and responsibly; follow all traffic rules.</li>
            <li>Return the vehicle on time and in the same condition, subject to normal wear and tear.</li>
            <li>Do not permit unauthorized drivers or use the vehicle for illegal or commercial racing activities.</li>
            <li>Report accidents, damages, or breakdowns immediately to the Owner and QuickRent.</li>
          </ul>
        </section>

        {/* 6. Bookings */}
        <section>
          <h2>6. Bookings, Payments, and Fees</h2>
          <ul>
            <li>Owners set base rental prices. Taxes and deposits may apply.</li>
            <li>QuickRent charges a Platform Fee to Owners and/or Renters per transaction.</li>
            <li>Payments are processed via approved methods; funds are disbursed to Owners less fees.</li>
            <li>Late returns, extra mileage, fuel charges, fines, and tolls may incur additional fees.</li>
          </ul>
        </section>

        {/* 7. Cancellations */}
        <section>
          <h2>7. Cancellations & Refunds</h2>
          <ul>
            <li>Each booking is subject to a cancellation policy shown at checkout.</li>
            <li>No-shows and late cancellations may be non-refundable.</li>
            <li>Platform Fees may be non-refundable except where required by law.</li>
          </ul>
        </section>

        {/* 8. Insurance */}
        <section>
          <h2>8. Insurance, Damage & Liability</h2>
          <ul>
            <li>Owners are responsible for maintaining required insurance on listed vehicles.</li>
            <li>Renters are liable for damages, traffic violations, and penalties incurred during the rental.</li>
            <li>In case of incidents, parties must cooperate with law enforcement, insurers, and QuickRent.</li>
          </ul>
        </section>

        {/* 9. Prohibited Uses */}
        <section>
          <h2>9. Prohibited Uses</h2>
          <ul>
            <li>Operating under the influence of alcohol, drugs, or while distracted.</li>
            <li>Racing, towing, carrying hazardous materials, or overloading the vehicle.</li>
            <li>Subletting the vehicle or using it for illegal activities.</li>
          </ul>
        </section>

        {/* 10. Disputes */}
        <section>
          <h2>10. Disputes</h2>
          <p>
            We encourage amicable resolution between Owner and Renter. If unresolved, contact QuickRent support
            with evidence. QuickRent may mediate at its discretion, but is not a party to the rental agreement
            between Owner and Renter.
          </p>
        </section>

        {/* 11. Platform Access */}
        <section>
          <h2>11. Platform Access & Termination</h2>
          <ul>
            <li>We may suspend or terminate accounts for violations or fraudulent activity.</li>
            <li>We may update these Terms periodically. Continued use constitutes acceptance of changes.</li>
          </ul>
        </section>

        {/* 12. Privacy & Data Use */}
        <section>
          <h2>12. Privacy & Data Use</h2>
          <ul>
            <li>We collect and process personal data in accordance with our <Link to="/privacy">Privacy Policy</Link>.</li>
            <li>By using the platform, you consent to data storage, processing, and sharing as necessary for transactions.</li>
            <li>We do not sell your personal data to third parties.</li>
          </ul>
        </section>

        {/* 13. Indemnification */}
        <section>
          <h2>13. Indemnification</h2>
          <p>
            You agree to indemnify and hold QuickRent harmless from claims, damages, liabilities, and expenses
            arising from your use of the platform, your breach of these Terms, or your violation of laws or third-party rights.
          </p>
        </section>

        {/* 14. Limitation of Liability */}
        <section>
          <h2>14. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, QuickRent is not liable for indirect, incidental, or consequential damages,
            including lost profits, arising from use of the platform or rentals.
          </p>
        </section>

        {/* 15. Governing Law */}
        <section>
          <h2>15. Governing Law & Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India.
            Any disputes shall be subject to the exclusive jurisdiction of the courts in Gandhinagar, Gujarat.
          </p>
        </section>

        {/* 16. Contact */}
        <section>
          <h2>16. Contact</h2>
          <p>
            Questions? <Link to="/">Visit Home</Link> or contact support at <a href="mailto:support@quickrent.app">support@quickrent.app</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

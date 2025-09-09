import { useNavigate } from 'react-router-dom';
import Welcome from './welcome.jsx';
import '../styles/HomeAds.css';

export default function Home() {
  const navigate = useNavigate();
  function redirectToRole(rolePath) { if (rolePath) navigate(rolePath); }

  return (
    <div>
      <Welcome />

      <section className="ads-section">
        <h3 className="ads-title">Popular Rentals & Offers</h3>
        <div className="ads-grid">
          <div className="ad-card">
            <img src="/lv1.avif" alt="Hatchbacks" />
            <div className="ad-info">
              <h4>City Hatchbacks</h4>
              <p>Perfect for daily commute. From ₹499/day</p>
            </div>
          </div>
          <div className="ad-card">
            <img src="/vl3.jpg" alt="SUVs" />
            <div className="ad-info">
              <h4>Comfort SUVs</h4>
              <p>Weekend getaways. From ₹999/day</p>
            </div>
          </div>
          <div className="ad-card">
            <img src="/vlist.jpeg" alt="Sedans" />
            <div className="ad-info">
              <h4>Executive Sedans</h4>
              <p>Business trips. From ₹899/day</p>
            </div>
          </div>
          <div className="ad-card">
            <img src="/lv2.webp" alt="Long trips" />
            <div className="ad-info">
              <h4>Long Trips</h4>
              <p>Unlimited kms options available</p>
            </div>
          </div>
        </div>

        <div className="ads-banner">
          <div className="banner-left">
            <h4>First Ride Offer</h4>
            <p>Flat 20% off for new users. Use code: FIRST20</p>
          </div>
          <button className="banner-cta" onClick={() => navigate('/renter/login')}>Book Now</button>
        </div>
      </section>
    </div>
  );
}

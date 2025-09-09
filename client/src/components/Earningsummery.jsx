import React, { useEffect } from "react";
import "../styles/Earningsummery.css";

export default function Earningsummery() {
  useEffect(() => {
    const ctx = document.getElementById("earningsChart");
    const ChartLib = typeof window !== 'undefined' ? window.Chart : undefined;
    if (ctx && ChartLib) {
      new ChartLib(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Earnings (₹)",
              data: [12000, 15000, 10000, 18000, 14000, 13000],
              borderColor: "#004AAD",
              backgroundColor: "rgba(0, 74, 173, 0.2)",
              fill: true,
              tension: 0.3,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }
  }, []);

  return (
    <div className="EAR">
      {/* Navbar */}
      <div className="earn-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" />
        <h1>Owner Earnings Summary</h1>
      </div>

      {/* Container */}
      <div className="earn-container">
        {/* Earnings Cards */}
        <div className="earn-cards">
          <div className="earn-card">
            <h3>
              <i className="fas fa-wallet"></i> Total Earnings
            </h3>
            <p>₹72,000</p>
          </div>
          <div className="earn-card">
            <h3>
              <i className="fas fa-car"></i> Active Rentals
            </h3>
            <p>5</p>
          </div>
          <div className="earn-card">
            <h3>
              <i className="fas fa-clock"></i> Pending Payouts
            </h3>
            <p>₹8,000</p>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="earn-chart">
          <h2>Earnings Trend</h2>
          <canvas id="earningsChart"></canvas>
        </div>

        {/* Transactions Table */}
        <div className="earn-transactions">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Renter</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#B1234</td>
                <td>Hyundai i20</td>
                <td>Rahul Mehta</td>
                <td>₹3,500</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>#B1235</td>
                <td>Honda Activa</td>
                <td>Priya Sharma</td>
                <td>₹1,200</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td>#B1236</td>
                <td>Maruti Swift</td>
                <td>Karan Patel</td>
                <td>₹4,000</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

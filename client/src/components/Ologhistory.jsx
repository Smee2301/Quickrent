import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ologhistory.css";

export default function Ologhistory() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadLoginHistory();
  }, []);

  const loadLoginHistory = async () => {
    try {
      const token = localStorage.getItem("qr_token");
      const user = JSON.parse(localStorage.getItem("qr_user") || "{}");
      
      if (!token || !user.id) {
        navigate("/owner/login", { replace: true });
        return;
      }

      const response = await fetch(`http://localhost:4000/api/users/${user.id}/login-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLoginHistory(data);
      } else {
        throw new Error('Failed to load login history');
      }
    } catch (error) {
      console.error("Error loading login history:", error);
      setError("Failed to load login history");
      
      // Fallback to mock data if API fails
      const mockHistory = [
        {
          id: 1,
          action: 'login',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1',
          device: 'Chrome on Windows 10',
          location: 'Mumbai, India'
        },
        {
          id: 2,
          action: 'logout',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ip: '192.168.1.1',
          device: 'Chrome on Windows 10',
          location: 'Mumbai, India'
        },
        {
          id: 3,
          action: 'login',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ip: '192.168.1.1',
          device: 'Chrome on Windows 10',
          location: 'Mumbai, India'
        },
        {
          id: 4,
          action: 'logout',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          ip: '192.168.1.1',
          device: 'Chrome on Windows 10',
          location: 'Mumbai, India'
        }
      ];
      setLoginHistory(mockHistory);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    return action === 'login' ? 'fas fa-sign-in-alt' : 'fas fa-sign-out-alt';
  };

  const getActionColor = (action) => {
    return action === 'login' ? 'success' : 'warning';
  };

  const getActionText = (action) => {
    return action === 'login' ? 'Login' : 'Logout';
  };

  if (loading) {
    return (
      <div className="ologhistory-page">
        <div className="olh-container">
          <div className="loading">Loading login history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ologhistory-page">
      {/* Navbar */}
      <div className="olh-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="olh-logo" />
        <h1>QuickRent - Login History</h1>
      </div>

      {/* Container */}
      <div className="olh-container">
        <div className="olh-header">
          <h2>
            <i className="fas fa-history"></i> Login History
          </h2>
          <button 
            className="btn-back"
            onClick={() => navigate("/owner/dashboard")}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="olh-content">
          {loginHistory.length === 0 ? (
            <div className="no-history">
              <i className="fas fa-history"></i>
              <h3>No login history found</h3>
              <p>Your login history will appear here</p>
            </div>
          ) : (
            <div className="history-list">
              {loginHistory.map((entry) => (
                <div key={entry.id} className={`history-item ${getActionColor(entry.action)}`}>
                  <div className="history-icon">
                    <i className={getActionIcon(entry.action)}></i>
                  </div>
                  
                  <div className="history-details">
                    <div className="history-header">
                      <h4>{getActionText(entry.action)}</h4>
                      <span className="history-time">{formatDateTime(entry.timestamp)}</span>
                    </div>
                    
                    <div className="history-info">
                      <div className="info-row">
                        <span className="info-label">
                          <i className="fas fa-desktop"></i> Device:
                        </span>
                        <span className="info-value">{entry.device}</span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">
                          <i className="fas fa-map-marker-alt"></i> Location:
                        </span>
                        <span className="info-value">{entry.location || 'Unknown'}</span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">
                          <i className="fas fa-network-wired"></i> IP Address:
                        </span>
                        <span className="info-value">{entry.ip}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="history-status">
                    <span className={`status-badge ${getActionColor(entry.action)}`}>
                      {getActionText(entry.action)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

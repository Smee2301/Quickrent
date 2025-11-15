import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Ologhistory.css";

export default function Ologhistory() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, login, logout
  const [dateRange, setDateRange] = useState("all"); // all, today, week, month
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    loadLoginHistory();
  }, []);

  // Filter and paginate history
  useEffect(() => {
    let filtered = [...loginHistory];

    // Filter by action type
    if (filter !== "all") {
      filtered = filtered.filter(entry => entry.action === filter);
    }

    // Filter by date range
    const now = new Date();
    switch (dateRange) {
      case "today":
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = filtered.filter(entry => new Date(entry.timestamp) >= today);
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(entry => new Date(entry.timestamp) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(entry => new Date(entry.timestamp) >= monthAgo);
        break;
      default:
        // all - no filtering
        break;
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredHistory(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [loginHistory, filter, dateRange]);

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
      
      // Fallback to mock data if API fails - Multiple days of login history
      const mockHistory = [
        {
          id: 1,
          action: 'login',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 2,
          action: 'logout',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 3,
          action: 'login',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 4,
          action: 'logout',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(), // 1 day 4 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 5,
          action: 'login',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 6,
          action: 'logout',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(), // 2 days 3 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 7,
          action: 'login',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 8,
          action: 'logout',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), // 3 days 2 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 9,
          action: 'login',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 10,
          action: 'logout',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString(), // 4 days 5 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 11,
          action: 'login',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 12,
          action: 'logout',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(), // 5 days 6 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 13,
          action: 'login',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 14,
          action: 'logout',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(), // 1 week 4 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 15,
          action: 'login',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 16,
          action: 'logout',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(), // 10 days 3 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 17,
          action: 'login',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 18,
          action: 'logout',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), // 2 weeks 2 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 19,
          action: 'login',
          timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
          location: 'Mumbai, India'
        },
        {
          id: 20,
          action: 'logout',
          timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString(), // 3 weeks 5 hours ago
          ip: '192.168.1.105',
          device: 'Chrome on Windows 11',
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

  // Pagination helpers
  const getTotalPages = () => {
    return Math.ceil(filteredHistory.length / itemsPerPage);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredHistory.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Statistics
  const getStatistics = () => {
    const totalLogins = loginHistory.filter(entry => entry.action === 'login').length;
    const totalLogouts = loginHistory.filter(entry => entry.action === 'logout').length;
    const todayLogins = loginHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const today = new Date();
      return entryDate.toDateString() === today.toDateString() && entry.action === 'login';
    }).length;
    
    return { totalLogins, totalLogouts, todayLogins };
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const entryDate = new Date(timestamp);
    const diffMs = now - entryDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
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
            className="logh-back"
            onClick={() => navigate("/owner/dashboard")}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        {/* Statistics */}
        <div className="olh-stats">
          {(() => {
            const stats = getStatistics();
            return (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-sign-in-alt"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalLogins}</h3>
                    <p>Total Logins</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalLogouts}</h3>
                    <p>Total Logouts</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.todayLogins}</h3>
                    <p>Today's Logins</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Filters */}
        <div className="olh-filters">
          <div className="filter-group">
            <label htmlFor="action-filter">Action:</label>
            <select 
              id="action-filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              <option value="login">Login Only</option>
              <option value="logout">Logout Only</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="date-filter">Date Range:</label>
            <select 
              id="date-filter"
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div className="filter-info">
            <span>Showing {filteredHistory.length} of {loginHistory.length} records</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="olh-content">
          {filteredHistory.length === 0 ? (
            <div className="no-history">
              <i className="fas fa-history"></i>
              <h3>No login history found</h3>
              <p>No records match your current filters</p>
            </div>
          ) : (
            <>
              <div className="history-list">
                {getCurrentPageData().map((entry) => (
                  <div key={entry.id} className={`history-item ${getActionColor(entry.action)}`}>
                    <div className="history-icon">
                      <i className={getActionIcon(entry.action)}></i>
                    </div>
                    
                    <div className="history-details">
                      <div className="history-header">
                        <h4>{getActionText(entry.action)}</h4>
                        <div className="history-time-info">
                          <span className="history-time">{formatDateTime(entry.timestamp)}</span>
                          <span className="history-relative">{formatRelativeTime(entry.timestamp)}</span>
                        </div>
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

              {/* Pagination */}
              {getTotalPages() > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  
                  <div className="pagination-info">
                    Page {currentPage} of {getTotalPages()}
                  </div>
                  
                  <button 
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

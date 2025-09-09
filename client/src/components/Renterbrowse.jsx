import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Renterbrowse.css";

export default function Renterbrowse() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    fuel: "",
    transmission: "",
    minPrice: "",
    maxPrice: "",
    location: ""
  });
  const [sortBy, setSortBy] = useState("name");
  const [userLocation, setUserLocation] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    totalHours: 0,
    totalCost: 0
  });

  // Sample vehicle data (in real app, this would come from API)
  const sampleVehicles = [
    {
      id: 1,
      img: "/lv1.avif",
      alt: "Sedan",
      name: "Hyundai Verna",
      type: "Sedan",
      fuel: "Petrol",
      transmission: "Automatic",
      rent: 200,
      location: "Ahmedabad",
      coordinates: { lat: 23.0225, lng: 72.5714 },
      rating: 4.2,
      reviews: 156,
      features: ["AC", "Power Steering", "Music System"],
      available: true,
      owner: "John Smith",
      contact: "+91 98765 43210"
    },
    {
      id: 2,
      img: "/lv2.webp",
      alt: "SUV",
      name: "Toyota Fortuner",
      type: "SUV",
      fuel: "Diesel",
      transmission: "Manual",
      rent: 350,
      location: "Surat",
      coordinates: { lat: 21.1702, lng: 72.8311 },
      rating: 4.5,
      reviews: 89,
      features: ["AC", "Power Steering", "Music System", "GPS"],
      available: true,
      owner: "Priya Patel",
      contact: "+91 98765 43211"
    },
    {
      id: 3,
      img: "/vl3.jpg",
      alt: "Hatchback",
      name: "Maruti Swift",
      type: "Hatchback",
      fuel: "Petrol",
      transmission: "Manual",
      rent: 120,
      location: "Baroda",
      coordinates: { lat: 22.3072, lng: 73.1812 },
      rating: 4.8,
      reviews: 234,
      features: ["AC", "Power Steering"],
      available: true,
      owner: "Rajesh Kumar",
      contact: "+91 98765 43212"
    },
    {
      id: 4,
      img: "/vl4.jpg",
      alt: "Convertible",
      name: "BMW Z4 Convertible",
      type: "Convertible",
      fuel: "Petrol",
      transmission: "Automatic",
      rent: 600,
      location: "Mumbai",
      coordinates: { lat: 19.0760, lng: 72.8777 },
      rating: 4.9,
      reviews: 45,
      features: ["AC", "Power Steering", "Music System", "GPS", "Convertible"],
      available: true,
      owner: "Amit Shah",
      contact: "+91 98765 43213"
    },
    {
      id: 5,
      img: "/vl5.avif",
      alt: "Scooter",
      name: "Honda Activa 6G",
      type: "Scooter",
      fuel: "Petrol",
      transmission: "Automatic",
      rent: 40,
      location: "Rajkot",
      coordinates: { lat: 22.3039, lng: 70.8022 },
      rating: 3.5,
      reviews: 78,
      features: ["Storage", "Digital Display"],
      available: true,
      owner: "Suresh Mehta",
      contact: "+91 98765 43214"
    },
    {
      id: 6,
      img: "/vlist.jpeg",
      alt: "SUV",
      name: "Mahindra XUV700",
      type: "SUV",
      fuel: "Diesel",
      transmission: "Automatic",
      rent: 400,
      location: "Ahmedabad",
      coordinates: { lat: 23.0225, lng: 72.5714 },
      rating: 4.3,
      reviews: 123,
      features: ["AC", "Power Steering", "Music System", "GPS", "Sunroof"],
      available: true,
      owner: "Neha Gupta",
      contact: "+91 98765 43215"
    }
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  // Load vehicles and saved vehicles
  useEffect(() => {
    setVehicles(sampleVehicles);
    setFilteredVehicles(sampleVehicles);
    
    // Load saved vehicles from localStorage
    const saved = localStorage.getItem('savedVehicles');
    if (saved) {
      setSavedVehicles(JSON.parse(saved));
    }
  }, []);

  // Filter and search vehicles
  useEffect(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || vehicle.type === filters.type;
      const matchesFuel = !filters.fuel || vehicle.fuel === filters.fuel;
      const matchesTransmission = !filters.transmission || vehicle.transmission === filters.transmission;
      const matchesMinPrice = !filters.minPrice || vehicle.rent >= parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || vehicle.rent <= parseInt(filters.maxPrice);
      const matchesLocation = !filters.location || vehicle.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesSearch && matchesType && matchesFuel && matchesTransmission && 
             matchesMinPrice && matchesMaxPrice && matchesLocation;
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.rent - b.rent;
        case "price-high":
          return b.rent - a.rent;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          if (!userLocation) return 0;
          const distanceA = calculateDistance(userLocation, a.coordinates);
          const distanceB = calculateDistance(userLocation, b.coordinates);
          return distanceA - distanceB;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filters, sortBy, userLocation]);

  // Calculate distance between two coordinates
  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Save/unsave vehicle
  const toggleSaveVehicle = (vehicle) => {
    const isSaved = savedVehicles.some(v => v.id === vehicle.id);
    let newSavedVehicles;
    
    if (isSaved) {
      newSavedVehicles = savedVehicles.filter(v => v.id !== vehicle.id);
    } else {
      newSavedVehicles = [...savedVehicles, vehicle];
    }
    
    setSavedVehicles(newSavedVehicles);
    localStorage.setItem('savedVehicles', JSON.stringify(newSavedVehicles));
  };

  // Open booking modal
  const openBookingModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  // Calculate booking cost
  const calculateBookingCost = () => {
    if (bookingDetails.pickupDate && bookingDetails.returnDate && 
        bookingDetails.pickupTime && bookingDetails.returnTime) {
      const pickup = new Date(`${bookingDetails.pickupDate}T${bookingDetails.pickupTime}`);
      const returnTime = new Date(`${bookingDetails.returnDate}T${bookingDetails.returnTime}`);
      const diffMs = returnTime - pickup;
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      
      setBookingDetails(prev => ({
        ...prev,
        totalHours: diffHours,
        totalCost: diffHours * selectedVehicle.rent
      }));
    }
  };

  // Handle booking
  const handleBooking = () => {
    if (bookingDetails.totalHours > 0) {
      // In real app, this would make an API call
      alert(`Booking confirmed! Total cost: ₹${bookingDetails.totalCost} for ${bookingDetails.totalHours} hours`);
      setShowBookingModal(false);
      setBookingDetails({
        pickupDate: "",
        returnDate: "",
        pickupTime: "",
        returnTime: "",
        totalHours: 0,
        totalCost: 0
      });
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      type: "",
      fuel: "",
      transmission: "",
      minPrice: "",
      maxPrice: "",
      location: ""
    });
    setSearchTerm("");
  };

  return (
    <div className="rb-wrapper">
      {/* Navbar */}
      <div className="rb-navbar">
        <img src="/logo1.png" alt="QuickRent Logo" className="rb-logo" />
        <h1>QuickRent - Available Vehicles</h1>
      </div>

      {/* Container */}
      <div className="rb-container">
        <h2>
          <i className="fas fa-car"></i> Browse & Book Vehicles
        </h2>

        {/* Search and Filters */}
        <div className="rb-filters">
          <div className="rb-search-section">
            <div className="rb-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search vehicles by name, type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="rb-clear-btn" onClick={clearFilters}>
              <i className="fas fa-times"></i> Clear Filters
            </button>
          </div>

          <div className="rb-filter-row">
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              <option value="Scooter">Scooter</option>
            </select>

            <select
              value={filters.fuel}
              onChange={(e) => setFilters({...filters, fuel: e.target.value})}
            >
              <option value="">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>

            <select
              value={filters.transmission}
              onChange={(e) => setFilters({...filters, transmission: e.target.value})}
            >
              <option value="">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>

            <input
              type="number"
              placeholder="Min Price (₹/hr)"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            />

            <input
              type="number"
              placeholder="Max Price (₹/hr)"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="rb-results-count">
          <p>Found {filteredVehicles.length} vehicles</p>
          {userLocation && (
            <p className="rb-location-info">
              <i className="fas fa-map-marker-alt"></i> Showing vehicles near you
            </p>
          )}
        </div>

        {/* Vehicle List */}
        <div className="rb-vehicle-list">
          {filteredVehicles.map((vehicle) => {
            const isSaved = savedVehicles.some(v => v.id === vehicle.id);
            const distance = userLocation ? calculateDistance(userLocation, vehicle.coordinates) : null;
            
            return (
              <div className="rb-vehicle-card" key={vehicle.id}>
                <div className="rb-image-container">
                  <img src={vehicle.img} alt={vehicle.alt} />
                  <div className="rb-vehicle-badge">
                    <span className={`rb-status ${vehicle.available ? 'available' : 'unavailable'}`}>
                      {vehicle.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {distance && (
                    <div className="rb-distance">
                      <i className="fas fa-map-marker-alt"></i>
                      {distance.toFixed(1)} km away
                    </div>
                  )}
                </div>
                
                <div className="rb-content">
                  <div className="rb-header">
                    <h3>{vehicle.name}</h3>
                    <div className="rb-rating">
                      <span>⭐ {vehicle.rating}</span>
                      <span>({vehicle.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="rb-details">
                    <p><span className="rb-highlight">Type:</span> {vehicle.type}</p>
                    <p><span className="rb-highlight">Fuel:</span> {vehicle.fuel} | <span className="rb-highlight">Transmission:</span> {vehicle.transmission}</p>
                    <p><span className="rb-highlight">Rent:</span> ₹{vehicle.rent} / hour</p>
                    <p><span className="rb-highlight">Location:</span> {vehicle.location}</p>
                    <p><span className="rb-highlight">Owner:</span> {vehicle.owner}</p>
                  </div>

                  <div className="rb-features">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="rb-feature-tag">{feature}</span>
                    ))}
                  </div>

                  <div className="rb-actions">
                    <button 
                      className="rb-btn-book" 
                      onClick={() => openBookingModal(vehicle)}
                      disabled={!vehicle.available}
                    >
                      <i className="fas fa-calendar-check"></i> Book Now
                    </button>
                    <button 
                      className={`rb-btn-save ${isSaved ? 'saved' : ''}`}
                      onClick={() => toggleSaveVehicle(vehicle)}
                    >
                      <i className={`fa ${isSaved ? 'fa-heart' : 'fa-heart-o'}`}></i> 
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button className="rb-btn-details">
                      <i className="fas fa-info-circle"></i> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="rb-no-results">
            <i className="fas fa-search"></i>
            <h3>No vehicles found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && (
        <div className="rb-modal">
          <div className="rb-modal-content">
            <div className="rb-modal-header">
              <h3>Book {selectedVehicle.name}</h3>
              <button 
                className="rb-modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="rb-modal-body">
              <div className="rb-booking-form">
                <div className="rb-form-group">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    value={bookingDetails.pickupDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, pickupDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="rb-form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    value={bookingDetails.returnDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, returnDate: e.target.value})}
                    min={bookingDetails.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="rb-form-group">
                  <label>Pickup Time</label>
                  <input
                    type="time"
                    value={bookingDetails.pickupTime}
                    onChange={(e) => setBookingDetails({...bookingDetails, pickupTime: e.target.value})}
                  />
                </div>
                
                <div className="rb-form-group">
                  <label>Return Time</label>
                  <input
                    type="time"
                    value={bookingDetails.returnTime}
                    onChange={(e) => setBookingDetails({...bookingDetails, returnTime: e.target.value})}
                  />
                </div>
                
                <button 
                  className="rb-calculate-btn"
                  onClick={calculateBookingCost}
                >
                  Calculate Cost
                </button>
                
                {bookingDetails.totalHours > 0 && (
                  <div className="rb-cost-summary">
                    <h4>Booking Summary</h4>
                    <p>Duration: {bookingDetails.totalHours} hours</p>
                    <p>Rate: ₹{selectedVehicle.rent} / hour</p>
                    <p className="rb-total-cost">Total Cost: ₹{bookingDetails.totalCost}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rb-modal-footer">
              <button 
                className="rb-btn-cancel"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button 
                className="rb-btn-confirm"
                onClick={handleBooking}
                disabled={bookingDetails.totalHours <= 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
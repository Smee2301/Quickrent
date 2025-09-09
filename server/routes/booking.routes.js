const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');

// Mock booking data for now - in production, this would be a proper Booking model
// This will be populated with actual user IDs when users create bookings
const mockBookings = [
  {
    id: '1',
    ownerId: 'mock-owner-id', // This will be replaced with actual user ID
    renterId: 'renter-1',
    vehicleId: 'vehicle-1',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    totalAmount: 3500,
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    ownerId: 'mock-owner-id', // This will be replaced with actual user ID
    renterId: 'renter-2',
    vehicleId: 'vehicle-2',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    totalAmount: 5000,
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

// Get bookings for an owner
router.get('/owner/:ownerId', authRequired, async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    // Check if the authenticated user is requesting their own bookings
    if (req.userId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Create dynamic mock data for this specific user
    const userBookings = [
      {
        id: '1',
        ownerId: ownerId,
        renterId: 'renter-1',
        vehicleId: 'vehicle-1',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        totalAmount: 3500,
        status: 'completed',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        ownerId: ownerId,
        renterId: 'renter-2',
        vehicleId: 'vehicle-2',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        totalAmount: 5000,
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bookings for a renter
router.get('/renter/:renterId', authRequired, async (req, res) => {
  try {
    const { renterId } = req.params;
    
    // Check if the authenticated user is requesting their own bookings
    if (req.userId !== renterId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Filter bookings for this renter
    const renterBookings = mockBookings.filter(booking => booking.renterId === renterId);
    
    res.json(renterBookings);
  } catch (error) {
    console.error('Error fetching renter bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new booking
router.post('/', authRequired, async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, totalAmount } = req.body;
    
    if (!vehicleId || !startDate || !endDate || !totalAmount) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }
    
    const newBooking = {
      id: Date.now().toString(),
      ownerId: req.userId, // This would be fetched from vehicle data in production
      renterId: req.userId,
      vehicleId,
      startDate,
      endDate,
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    mockBookings.push(newBooking);
    
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update booking status
router.put('/:bookingId/status', authRequired, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to update this booking
    if (booking.ownerId !== req.userId && booking.renterId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const { emitToUser } = require('../socket');

// Get bookings for an owner
router.get('/owner/:ownerId', authRequired, async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    // Check if the authenticated user is requesting their own bookings
    if (req.userId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const bookings = await Booking.find({ ownerId })
      .populate('vehicleId', 'brand model vehicleNumber photo type')
      .populate('renterId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
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
    
    const bookings = await Booking.find({ renterId })
      .populate('vehicleId', 'brand model vehicleNumber photo type')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching renter bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new booking
router.post('/', authRequired, async (req, res) => {
  try {
    const { 
      vehicleId, 
      pickupDate, 
      returnDate, 
      pickupTime, 
      returnTime,
      totalHours,
      totalAmount,
      renterNotes
    } = req.body;
    
    // Validate required fields
    if (!vehicleId || !pickupDate || !returnDate || !pickupTime || !returnTime || !totalHours || !totalAmount) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }
    
    // Get vehicle details to find owner and other info
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user is trying to book their own vehicle
    if (vehicle.ownerId.toString() === req.userId) {
      return res.status(400).json({ message: 'You cannot book your own vehicle' });
    }
    
    // Create booking
    const booking = await Booking.create({
      vehicleId,
      ownerId: vehicle.ownerId,
      renterId: req.userId,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      pickupLocation: vehicle.pickupLocation,
      returnLocation: vehicle.returnLocation,
      totalHours: parseInt(totalHours),
      hourlyRate: vehicle.rentPerHour,
      totalAmount: parseFloat(totalAmount),
      securityDeposit: vehicle.securityDeposit,
      status: 'pending',
      renterNotes
    });
    
    // Populate booking details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicleId', 'brand model vehicleNumber photo type')
      .populate('renterId', 'name email phone');
    
    // Create notification for owner
    const notification = await Notification.create({
      userId: vehicle.ownerId,
      userType: 'Owner',
      type: 'booking_request',
      title: 'New Booking Request',
      message: `New booking request for your ${vehicle.brand} ${vehicle.model}`,
      relatedId: booking._id,
      relatedType: 'Booking',
      metadata: {
        vehicleId: vehicle._id,
        renterId: req.userId,
        pickupDate,
        totalAmount
      }
    });
    
    // Emit real-time event to owner
    emitToUser(vehicle.ownerId.toString(), 'new_booking_request', {
      booking: populatedBooking,
      notification
    });
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Approve booking (owner only)
router.put('/:bookingId/approve', authRequired, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { ownerNotes } = req.body;
    
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId', 'brand model vehicleNumber photo')
      .populate('renterId', 'name email phone');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the owner
    if (booking.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the vehicle owner can approve bookings' });
    }
    
    // Update booking status
    booking.status = 'approved';
    booking.ownerNotes = ownerNotes;
    await booking.save();
    
    // Create notification for renter
    const notification = await Notification.create({
      userId: booking.renterId,
      userType: 'Renter',
      type: 'booking_approved',
      title: 'Booking Approved! 🎉',
      message: `Your booking for ${booking.vehicleId.brand} ${booking.vehicleId.model} has been approved`,
      relatedId: booking._id,
      relatedType: 'Booking',
      metadata: {
        vehicleId: booking.vehicleId._id,
        pickupDate: booking.pickupDate,
        ownerNotes
      }
    });
    
    // Emit real-time event to renter
    emitToUser(booking.renterId.toString(), 'booking_approved', {
      booking,
      notification
    });
    
    res.json(booking);
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject booking (owner only)
router.put('/:bookingId/reject', authRequired, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rejectionReason } = req.body;
    
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId', 'brand model vehicleNumber photo')
      .populate('renterId', 'name email phone');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the owner
    if (booking.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the vehicle owner can reject bookings' });
    }
    
    // Update booking status
    booking.status = 'rejected';
    booking.rejectionReason = rejectionReason || 'No reason provided';
    await booking.save();
    
    // Create notification for renter
    const notification = await Notification.create({
      userId: booking.renterId,
      userType: 'Renter',
      type: 'booking_rejected',
      title: 'Booking Not Approved',
      message: `Your booking for ${booking.vehicleId.brand} ${booking.vehicleId.model} was not approved`,
      relatedId: booking._id,
      relatedType: 'Booking',
      metadata: {
        vehicleId: booking.vehicleId._id,
        rejectionReason: booking.rejectionReason
      }
    });
    
    // Emit real-time event to renter
    emitToUser(booking.renterId.toString(), 'booking_rejected', {
      booking,
      notification
    });
    
    res.json(booking);
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel booking (renter only, within 10 hours of booking)
router.put('/:bookingId/cancel', authRequired, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;
    
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId', 'brand model vehicleNumber photo')
      .populate('renterId', 'name email phone')
      .populate('ownerId', 'name email phone');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the renter
    if (booking.renterId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the renter can cancel their booking' });
    }
    
    // Check if booking can be cancelled (within 10 hours of creation)
    const bookingTime = new Date(booking.createdAt);
    const currentTime = new Date();
    const hoursSinceBooking = (currentTime - bookingTime) / (1000 * 60 * 60);
    
    if (hoursSinceBooking > 10) {
      return res.status(400).json({ message: 'Booking can only be cancelled within 10 hours of creation' });
    }
    
    // Check if booking is already cancelled or completed
    if (['cancelled', 'completed', 'rejected'].includes(booking.status)) {
      return res.status(400).json({ message: `Booking cannot be cancelled. Current status: ${booking.status}` });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by renter';
    booking.cancelledAt = new Date();
    await booking.save();
    
    // Create notification for owner
    const notification = await Notification.create({
      userId: booking.ownerId._id,
      userType: 'Owner',
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Booking for ${booking.vehicleId.brand} ${booking.vehicleId.model} has been cancelled by the renter`,
      relatedId: booking._id,
      relatedType: 'Booking',
      metadata: {
        vehicleId: booking.vehicleId._id,
        renterId: booking.renterId._id,
        cancellationReason: booking.cancellationReason
      }
    });
    
    // Emit real-time event to owner
    emitToUser(booking.ownerId._id.toString(), 'booking_cancelled', {
      booking,
      notification
    });
    
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

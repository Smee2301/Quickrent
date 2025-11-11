const router = require('express').Router();
const Owner = require('../models/Owner');
const Vehicle = require('../models/Vehicle');
const { ownerRequired, getUserDetails, checkAccountStatus } = require('../middleware/auth');

// ==================== OWNER PROFILE MANAGEMENT ====================

// Get owner profile
router.get('/profile', ownerRequired, getUserDetails, checkAccountStatus, async (req, res) => {
  try {
    res.json({ owner: req.user });
  } catch (err) {
    console.error('Get owner profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update owner profile
router.put('/profile', ownerRequired, getUserDetails, checkAccountStatus, async (req, res) => {
  try {
    const {
      name,
      phone,
      city,
      address,
      dateOfBirth,
      businessName,
      businessType,
      businessRegistrationNumber,
      taxId,
      emergencyContact
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (city) updateData.city = city.trim();
    if (address) updateData.address = address.trim();
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (businessName) updateData.businessName = businessName.trim();
    if (businessType) updateData.businessType = businessType;
    if (businessRegistrationNumber) updateData.businessRegistrationNumber = businessRegistrationNumber.trim();
    if (taxId) updateData.taxId = taxId.trim();
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    const owner = await Owner.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      owner 
    });
  } catch (err) {
    console.error('Update owner profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update owner settings
// router.put('/settings', authRequired, async (req, res) => {
//   try {
//     const {
//       notificationSettings,
//       preferredLanguage,
//       timezone
//     } = req.body;

//     const updateData = {};
    
//     if (notificationSettings) updateData.notificationSettings = notificationSettings;
//     if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
//     if (timezone) updateData.timezone = timezone;

//     const owner = await Owner.findByIdAndUpdate(
//       req.userId,
//       updateData,
//       { new: true, runValidators: true }
//     ).select('-passwordHash');

//     if (!owner) {
//       return res.status(404).json({ message: 'Owner not found' });
//     }

//     res.json({ 
//       message: 'Settings updated successfully',
//       owner 
//     });
//   } catch (err) {
//     console.error('Update owner settings error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// ==================== OWNER VERIFICATION ====================

// Upload identity document
router.post('/upload-identity', authRequired, async (req, res) => {
  try {
    const { documentPath } = req.body;
    
    if (!documentPath) {
      return res.status(400).json({ message: 'Document path is required' });
    }

    const owner = await Owner.findByIdAndUpdate(
      req.userId,
      { identityDocument: documentPath },
      { new: true }
    ).select('-passwordHash');

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.json({ 
      message: 'Identity document uploaded successfully',
      owner 
    });
  } catch (err) {
    console.error('Upload identity document error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload business document
router.post('/upload-business-document', authRequired, async (req, res) => {
  try {
    const { documentPath } = req.body;
    
    if (!documentPath) {
      return res.status(400).json({ message: 'Document path is required' });
    }

    const owner = await Owner.findByIdAndUpdate(
      req.userId,
      { businessDocument: documentPath },
      { new: true }
    ).select('-passwordHash');

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.json({ 
      message: 'Business document uploaded successfully',
      owner 
    });
  } catch (err) {
    console.error('Upload business document error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bank account details
router.put('/bank-details', authRequired, async (req, res) => {
  try {
    const { bankAccountDetails } = req.body;
    
    if (!bankAccountDetails) {
      return res.status(400).json({ message: 'Bank account details are required' });
    }

    const owner = await Owner.findByIdAndUpdate(
      req.userId,
      { bankAccountDetails },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.json({ 
      message: 'Bank account details updated successfully',
      owner 
    });
  } catch (err) {
    console.error('Update bank details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== OWNER DASHBOARD ====================

// Get owner dashboard data
router.get('/dashboard', authRequired, async (req, res) => {
  try {
    const owner = await Owner.findById(req.userId).select('-passwordHash');
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Get vehicles owned by this owner
    const vehicles = await Vehicle.find({ ownerId: req.userId });
    
    // Get recent bookings for owner's vehicles
    const recentBookings = await Vehicle.aggregate([
      { $match: { ownerId: req.userId } },
      { $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'vehicleId',
          as: 'bookings'
        }
      },
      { $unwind: { path: '$bookings', preserveNullAndEmptyArrays: true } },
      { $sort: { 'bookings.createdAt': -1 } },
      { $limit: 10 },
      { $project: {
          vehicleName: '$name',
          booking: '$bookings'
        }
      }
    ]);

    // Calculate earnings summary
    const earningsSummary = await Vehicle.aggregate([
      { $match: { ownerId: req.userId } },
      { $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'vehicleId',
          as: 'bookings'
        }
      },
      { $unwind: '$bookings' },
      { $group: {
          _id: null,
          totalEarnings: { $sum: '$bookings.totalAmount' },
          totalBookings: { $sum: 1 },
          averageBookingValue: { $avg: '$bookings.totalAmount' }
        }
      }
    ]);

    const dashboardData = {
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        businessName: owner.businessName,
        totalVehicles: owner.totalVehicles,
        totalEarnings: owner.totalEarnings,
        totalBookings: owner.totalBookings,
        averageRating: owner.averageRating,
        isFullyVerified: owner.isFullyVerified
      },
      vehicles: vehicles.map(vehicle => ({
        id: vehicle._id,
        name: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
        dailyRate: vehicle.dailyRate,
        isActive: vehicle.isActive
      })),
      recentBookings: recentBookings.filter(item => item.booking),
      earningsSummary: earningsSummary[0] || {
        totalEarnings: 0,
        totalBookings: 0,
        averageBookingValue: 0
      }
    };

    res.json({ dashboardData });
  } catch (err) {
    console.error('Get owner dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== OWNER ANALYTICS ====================

// Get owner earnings summary
router.get('/earnings', authRequired, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'year':
        dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    const earnings = await Vehicle.aggregate([
      { $match: { ownerId: req.userId } },
      { $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'vehicleId',
          as: 'bookings'
        }
      },
      { $unwind: '$bookings' },
      { $match: { 'bookings.createdAt': dateFilter } },
      { $group: {
          _id: {
            year: { $year: '$bookings.createdAt' },
            month: { $month: '$bookings.createdAt' },
            day: { $dayOfMonth: '$bookings.createdAt' }
          },
          totalEarnings: { $sum: '$bookings.totalAmount' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({ earnings });
  } catch (err) {
    console.error('Get owner earnings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get owner vehicle performance
router.get('/vehicle-performance', authRequired, async (req, res) => {
  try {
    const vehiclePerformance = await Vehicle.aggregate([
      { $match: { ownerId: req.userId } },
      { $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'vehicleId',
          as: 'bookings'
        }
      },
      { $project: {
          vehicleName: { $concat: ['$make', ' ', '$model', ' ', { $toString: '$year' }] },
          totalBookings: { $size: '$bookings' },
          totalEarnings: { $sum: '$bookings.totalAmount' },
          averageRating: '$averageRating',
          utilizationRate: {
            $multiply: [
              { $divide: [{ $size: '$bookings' }, 30] },
              100
            ]
          }
        }
      },
      { $sort: { totalEarnings: -1 } }
    ]);

    res.json({ vehiclePerformance });
  } catch (err) {
    console.error('Get vehicle performance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== OWNER NOTIFICATIONS ====================

// Get owner notifications
router.get('/notifications', authRequired, async (req, res) => {
  try {
    // This would typically come from a notifications collection
    // For now, we'll return a placeholder structure
    const notifications = [
      {
        id: '1',
        type: 'booking',
        title: 'New Booking Request',
        message: 'You have received a new booking request for your Toyota Camry 2020',
        isRead: false,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of $150 has been received for booking #12345',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    res.json({ notifications });
  } catch (err) {
    console.error('Get owner notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:notificationId/read', authRequired, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // This would typically update a notifications collection
    // For now, we'll return a success response
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark notification as read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

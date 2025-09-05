const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const User = require('../models/User');
const upload = require('../middleware/upload');

// Get user profile
router.get('/:id', authRequired, async (req, res) => {
  try {
    // Check if the authenticated user is requesting their own profile
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/:id', authRequired, upload.single('profileImage'), async (req, res) => {
  try {
    // Check if the authenticated user is updating their own profile
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updateData = { ...req.body };
    
    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get login history
router.get('/:id/login-history', authRequired, async (req, res) => {
  try {
    // Check if the authenticated user is requesting their own login history
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // For now, return mock login history data
    const loginHistory = [
      {
        id: 1,
        action: 'login',
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1',
        device: 'Chrome on Windows'
      },
      {
        id: 2,
        action: 'logout',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ip: '192.168.1.1',
        device: 'Chrome on Windows'
      }
    ];

    res.json(loginHistory);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

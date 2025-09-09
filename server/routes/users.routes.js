const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const User = require('../models/User');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');

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

// Change password
router.put('/:id/change-password', authRequired, async (req, res) => {
  try {
    // Check if the authenticated user is changing their own password
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(req.params.id, { password: hashedNewPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
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

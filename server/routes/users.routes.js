const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const Owner = require('../models/Owner');
const Renter = require('../models/Renter');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/:id', authRequired, async (req, res) => {
  try {
    // Check if the authenticated user is requesting their own profile
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Try to find in Owner collection first
    let user = await Owner.findById(req.params.id).select('-passwordHash');
    
    // If not found, try Renter collection
    if (!user) {
      user = await Renter.findById(req.params.id).select('-passwordHash');
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Debug log for profile image
    console.log('📸 GET /users/:id - Fetching profile for:', user.email);
    console.log('📸 Profile image in database:', user.profileImage || 'No image');

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

    console.log('📤 PUT /users/:id - Update request for user:', req.params.id);
    console.log('📤 File uploaded:', req.file ? req.file.filename : 'No file');
    console.log('📤 Request body:', req.body);

    const updateData = { ...req.body };
    
    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = req.file.filename;
      console.log('✅ Profile image set to:', updateData.profileImage);
    }
    
    // Remove fields that shouldn't be updated via this endpoint
    delete updateData.email; // Email can't be changed
    delete updateData.phone; // Phone can't be changed
    delete updateData.passwordHash;
    delete updateData.password;

    // Try to update in Owner collection first
    let user = await Owner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-passwordHash');
    
    // If not found, try Renter collection
    if (!user) {
      user = await Renter.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select('-passwordHash');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('💾 Saved user profile. ProfileImage:', user.profileImage || 'No image');

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

    // Find the user (try Owner first, then Renter)
    let user = await Owner.findById(req.params.id);
    let isOwner = true;
    
    if (!user) {
      user = await Renter.findById(req.params.id);
      isOwner = false;
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
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

    // Update password in the appropriate collection
    if (isOwner) {
      await Owner.findByIdAndUpdate(req.params.id, { passwordHash: hashedNewPassword });
    } else {
      await Renter.findByIdAndUpdate(req.params.id, { passwordHash: hashedNewPassword });
    }

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

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

// Input validation helper
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Check if user already exists (for client-side validation)
router.post('/check-existing', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ 
        message: 'Please provide either email or phone number',
        exists: false
      });
    }

    let existingUser;
    let field;

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          message: 'Please enter a valid email address',
          exists: false
        });
      }
      existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      field = 'email';
    } else if (phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ 
          message: 'Please enter a valid phone number',
          exists: false
        });
      }
      existingUser = await User.findOne({ phone: phone.trim() });
      field = 'phone';
    }
    
    if (existingUser) {
      return res.json({ 
        exists: true,
        field: field,
        message: `An account with this ${field} already exists`
      });
    }

    res.json({ 
      exists: false,
      message: `${field} is available`
    });
  } catch (err) {
    console.error('Check existing user error:', err);
    res.status(500).json({ 
      message: 'Server error. Please try again later.',
      exists: false
    });
  }
});

// Enhanced registration with comprehensive validation
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Comprehensive validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'All fields are required',
        field: !name ? 'name' : !email ? 'email' : !password ? 'password' : 'role'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Name must be at least 2 characters long',
        field: 'name'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address',
        field: 'email'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        field: 'password'
      });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ 
        message: 'Please enter a valid phone number',
        field: 'phone'
      });
    }

    if (!['owner', 'renter'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role selected',
        field: 'role'
      });
    }

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUserByEmail) {
      return res.status(409).json({ 
        message: 'An account with this email already exists. Please sign in instead.',
        field: 'email'
      });
    }

    // Check if user already exists with phone (if phone is provided)
    if (phone && phone.trim()) {
      const existingUserByPhone = await User.findOne({ phone: phone.trim() });
      if (existingUserByPhone) {
        return res.status(409).json({ 
          message: 'An account with this phone number already exists. Please sign in instead.',
          field: 'phone'
        });
      }
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      phone: phone ? phone.trim() : '', 
      role, 
      passwordHash 
    });

    res.status(201).json({ 
      message: 'Account created successfully! You can now sign in.',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Enhanced login with better error handling
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        field: !email ? 'email' : 'password'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address',
        field: 'email'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ 
        message: 'No account found with this email address. Please check your email or sign up.',
        field: 'email'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Incorrect password. Please try again.',
        field: 'password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { sub: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'dev_secret', 
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login successful!',
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Enhanced OTP sending with email/phone validation
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ 
        message: 'Please provide either email or phone number',
        field: 'contact'
      });
    }

    let user;
    let contactType;
    let contactValue;

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          message: 'Please enter a valid email address',
          field: 'email'
        });
      }
      user = await User.findOne({ email: email.toLowerCase().trim() });
      contactType = 'email';
      contactValue = email.toLowerCase().trim();
    } else if (phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ 
          message: 'Please enter a valid phone number',
          field: 'phone'
        });
      }
      user = await User.findOne({ phone: phone.trim() });
      contactType = 'phone';
      contactValue = phone.trim();
    }
    
    if (!user) {
      return res.status(404).json({ 
        message: `No account found with this ${contactType}. Please check your ${contactType} or sign up.`,
        field: contactType
      });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    otpStore.set(contactValue, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      userId: user._id
    });
    
    // In production, send OTP via email/SMS
    console.log(`OTP for ${contactType} ${contactValue}: ${otp}`);
    console.log(`User: ${user.name} (${user.role})`);
    
    res.json({ 
      message: `OTP sent to your ${contactType} successfully`,
      contactType,
      contactValue: contactType === 'email' ? 
        contactValue.replace(/(.{2})(.*)(?=@)/, (_, start, rest) => start + '*'.repeat(rest.length)) :
        contactValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3')
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Enhanced password reset with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, phone, otp, newPass } = req.body;
    
    if ((!email && !phone) || !otp || !newPass) {
      return res.status(400).json({ 
        message: 'All fields are required',
        field: !email && !phone ? 'contact' : !otp ? 'otp' : 'newPass'
      });
    }

    if (!validatePassword(newPass)) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        field: 'newPass'
      });
    }

    let contactValue;
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          message: 'Please enter a valid email address',
          field: 'email'
        });
      }
      contactValue = email.toLowerCase().trim();
    } else {
      if (!validatePhone(phone)) {
        return res.status(400).json({ 
          message: 'Please enter a valid phone number',
          field: 'phone'
        });
      }
      contactValue = phone.trim();
    }
    
    const storedOtpData = otpStore.get(contactValue);
    if (!storedOtpData) {
      return res.status(400).json({ 
        message: 'OTP not found or expired. Please request a new OTP.',
        field: 'otp'
      });
    }
    
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(contactValue);
      return res.status(400).json({ 
        message: 'OTP has expired. Please request a new OTP.',
        field: 'otp'
      });
    }
    
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ 
        message: 'Invalid OTP. Please check and try again.',
        field: 'otp'
      });
    }
    
    // Update password
    const passwordHash = await bcrypt.hash(newPass, 12);
    await User.findByIdAndUpdate(storedOtpData.userId, { passwordHash });
    
    // Remove OTP from store
    otpStore.delete(contactValue);
    
    res.json({ message: 'Password reset successful! You can now sign in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Check if account exists (for forgot account functionality)
router.post('/check-account', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ 
        message: 'Please provide either email or phone number',
        field: 'contact'
      });
    }

    let user;
    let contactType;
    let contactValue;

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          message: 'Please enter a valid email address',
          field: 'email'
        });
      }
      user = await User.findOne({ email: email.toLowerCase().trim() });
      contactType = 'email';
      contactValue = email.toLowerCase().trim();
    } else {
      if (!validatePhone(phone)) {
        return res.status(400).json({ 
          message: 'Please enter a valid phone number',
          field: 'phone'
        });
      }
      user = await User.findOne({ phone: phone.trim() });
      contactType = 'phone';
      contactValue = phone.trim();
    }
    
    if (!user) {
      return res.status(404).json({ 
        message: `No account found with this ${contactType}. Please check your ${contactType} or sign up.`,
        field: contactType
      });
    }

    // Return account info (without sensitive data)
    res.json({ 
      message: 'Account found!',
      accountInfo: {
        name: user.name,
        role: user.role,
        contactType,
        contactValue: contactType === 'email' ? 
          contactValue.replace(/(.{2})(.*)(?=@)/, (_, start, rest) => start + '*'.repeat(rest.length)) :
          contactValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3')
      }
    });
  } catch (err) {
    console.error('Check account error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;



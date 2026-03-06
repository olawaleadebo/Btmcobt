const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { validate, asyncHandler } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('role').optional().isIn(['admin', 'user', 'manager']).withMessage('Invalid role'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email, password, name, company, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Registration failed',
        message: 'Email already registered',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      company,
      role: role || 'user',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: user.toPublicJSON(),
      token,
    });
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Login failed',
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Login failed',
        message: 'Account is disabled',
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Login failed',
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      user: user.toPublicJSON(),
      token,
    });
  })
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can log the event or invalidate refresh tokens if implemented
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
});

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
router.put(
  '/update',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('company').optional().trim().notEmpty().withMessage('Company cannot be empty'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { name, company, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (company) user.company = company;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      user: user.toPublicJSON(),
    });
  })
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Password change failed',
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  })
);

module.exports = router;

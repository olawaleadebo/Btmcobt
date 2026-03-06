const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const emailService = require('../services/emailService');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const CarRental = require('../models/CarRental');
const Activity = require('../models/Activity');
const Restaurant = require('../models/Restaurant');
const Payment = require('../models/Payment');

// Helper to get booking model
const getBookingModel = (bookingType) => {
  switch (bookingType) {
    case 'flight': return Flight;
    case 'hotel': return Hotel;
    case 'car': return CarRental;
    case 'activity': return Activity;
    case 'restaurant': return Restaurant;
    default: return null;
  }
};

// @route   POST /api/emails/booking-confirmation
// @desc    Send booking confirmation email
// @access  Private
router.post(
  '/booking-confirmation',
  protect,
  [
    body('bookingId').trim().notEmpty().withMessage('Booking ID is required'),
    body('userEmail').isEmail().withMessage('Valid email required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { bookingId, userEmail } = req.body;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Try to find booking in all collections
    let booking = null;
    const models = [Flight, Hotel, CarRental, Activity, Restaurant];
    
    for (const Model of models) {
      booking = await Model.findById(bookingId);
      if (booking) break;
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Send email
    await emailService.sendBookingConfirmation(booking, user);

    res.json({
      success: true,
      message: 'Booking confirmation email sent',
    });
  })
);

// @route   POST /api/emails/payment-receipt
// @desc    Send payment receipt email
// @access  Private
router.post(
  '/payment-receipt',
  protect,
  [
    body('paymentId').trim().notEmpty().withMessage('Payment ID is required'),
    body('userEmail').isEmail().withMessage('Valid email required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { paymentId, userEmail } = req.body;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    // Find associated booking
    const BookingModel = getBookingModel(payment.bookingType);
    const booking = await BookingModel.findById(payment.bookingId);

    // Send email
    await emailService.sendPaymentReceipt(payment, user, booking);

    res.json({
      success: true,
      message: 'Payment receipt email sent',
    });
  })
);

// @route   POST /api/emails/cancellation
// @desc    Send booking cancellation email
// @access  Private
router.post(
  '/cancellation',
  protect,
  [
    body('bookingId').trim().notEmpty().withMessage('Booking ID is required'),
    body('bookingType').isIn(['flight', 'hotel', 'car', 'activity', 'restaurant']).withMessage('Invalid booking type'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { bookingId, bookingType } = req.body;

    const BookingModel = getBookingModel(bookingType);
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    const user = await User.findById(booking.userId);

    await emailService.sendCancellationEmail(booking, user);

    res.json({
      success: true,
      message: 'Cancellation email sent',
    });
  })
);

module.exports = router;

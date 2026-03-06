const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const Payment = require('../models/Payment');
const paystackService = require('../services/paystackService');
const { redis } = require('../server');

// Helper to publish payment updates
const publishPaymentUpdate = async (payment, userId) => {
  try {
    await redis.publish('payment_updates', JSON.stringify({
      type: 'payment_update',
      userId,
      data: payment,
      timestamp: new Date(),
    }));
  } catch (error) {
    console.error('Redis publish error:', error);
  }
};

// @route   POST /api/payments/initialize
// @desc    Initialize payment with Paystack
// @access  Private
router.post(
  '/initialize',
  protect,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
    body('reference').trim().notEmpty().withMessage('Reference is required'),
    body('currency').optional().isIn(['NGN', 'USD', 'GHS', 'ZAR', 'KES']).withMessage('Invalid currency'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const paymentData = req.body;

    // Initialize payment with Paystack
    const response = await paystackService.initializePayment(paymentData);

    res.json({
      success: true,
      data: response.data,
    });
  })
);

// @route   GET /api/payments/verify/:reference
// @desc    Verify payment with Paystack
// @access  Private
router.get(
  '/verify/:reference',
  protect,
  asyncHandler(async (req, res) => {
    const { reference } = req.params;

    // Verify payment with Paystack
    const response = await paystackService.verifyPayment(reference);

    if (response.data.status === 'success') {
      // Find and update payment record in database
      let payment = await Payment.findOne({ paystackReference: reference });
      
      if (payment) {
        payment.status = 'successful';
        payment.paystackResponse = response.data;
        await payment.save();

        // Publish payment update
        await publishPaymentUpdate(payment, payment.userId.toString());

        // TODO: Update booking status to 'confirmed'
        // const bookingModel = getBookingModel(payment.bookingType);
        // await bookingModel.findByIdAndUpdate(payment.bookingId, { status: 'confirmed' });
      }
    }

    res.json({
      success: true,
      data: response.data,
    });
  })
);

// @route   POST /api/payments
// @desc    Create payment record in database
// @access  Private
router.post(
  '/',
  protect,
  [
    body('bookingType').isIn(['flight', 'hotel', 'car', 'activity', 'restaurant']).withMessage('Invalid booking type'),
    body('bookingId').trim().notEmpty().withMessage('Booking ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount required'),
    body('paystackReference').trim().notEmpty().withMessage('Payment reference is required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const paymentData = {
      ...req.body,
      userId: req.user._id,
    };

    const payment = await Payment.create(paymentData);

    res.status(201).json({
      success: true,
      data: payment,
    });
  })
);

// @route   GET /api/payments
// @desc    Get user's payment history
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
    });
  })
);

// @route   GET /api/payments/:id
// @desc    Get payment details
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  })
);

module.exports = router;

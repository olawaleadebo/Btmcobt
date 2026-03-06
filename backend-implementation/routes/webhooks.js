const express = require('express');
const router = express.Router();
const paystackService = require('../services/paystackService');
const Payment = require('../models/Payment');
const emailService = require('../services/emailService');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const CarRental = require('../models/CarRental');
const Activity = require('../models/Activity');
const Restaurant = require('../models/Restaurant');
const { redis } = require('../server');

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

// @route   POST /api/webhooks/paystack
// @desc    Handle Paystack webhooks
// @access  Public (but verified)
router.post('/paystack', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-paystack-signature'];
    const isValid = paystackService.verifyWebhookSignature(req.body, signature);

    if (!isValid) {
      console.error('❌ Invalid Paystack webhook signature');
      return res.status(401).json({
        success: false,
        error: 'Invalid signature',
      });
    }

    const event = req.body;
    console.log(`📨 Paystack Webhook: ${event.event}`);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data);
        break;

      case 'transfer.success':
        await handleTransferSuccess(event.data);
        break;

      case 'transfer.failed':
        await handleTransferFailed(event.data);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
    });
  }
});

// Handle successful charge
async function handleChargeSuccess(data) {
  try {
    const reference = data.reference;

    // Find payment record
    const payment = await Payment.findOne({ paystackReference: reference });
    if (!payment) {
      console.error(`Payment not found for reference: ${reference}`);
      return;
    }

    // Update payment status
    payment.status = 'successful';
    payment.paystackResponse = data;
    payment.paymentMethod = data.channel;
    await payment.save();

    console.log(`✅ Payment ${reference} marked as successful`);

    // Update booking status
    const BookingModel = getBookingModel(payment.bookingType);
    if (BookingModel) {
      const booking = await BookingModel.findById(payment.bookingId);
      if (booking) {
        booking.status = 'confirmed';
        await booking.save();
        console.log(`✅ Booking ${booking.bookingReference} confirmed`);

        // Publish booking update via Redis/WebSocket
        await redis.publish('booking_updates', JSON.stringify({
          type: 'booking_update',
          userId: payment.userId.toString(),
          data: booking,
          timestamp: new Date(),
        }));

        // Send confirmation emails
        const user = await User.findById(payment.userId);
        if (user) {
          await emailService.sendBookingConfirmation(booking, user);
          await emailService.sendPaymentReceipt(payment, user, booking);
          console.log(`📧 Confirmation emails sent to ${user.email}`);
        }
      }
    }

    // Publish payment update via Redis/WebSocket
    await redis.publish('payment_updates', JSON.stringify({
      type: 'payment_update',
      userId: payment.userId.toString(),
      data: payment,
      timestamp: new Date(),
    }));

  } catch (error) {
    console.error('Error handling charge success:', error);
  }
}

// Handle failed charge
async function handleChargeFailed(data) {
  try {
    const reference = data.reference;

    const payment = await Payment.findOne({ paystackReference: reference });
    if (!payment) {
      console.error(`Payment not found for reference: ${reference}`);
      return;
    }

    payment.status = 'failed';
    payment.paystackResponse = data;
    await payment.save();

    console.log(`❌ Payment ${reference} marked as failed`);

    // Publish payment update
    await redis.publish('payment_updates', JSON.stringify({
      type: 'payment_update',
      userId: payment.userId.toString(),
      data: payment,
      timestamp: new Date(),
    }));

  } catch (error) {
    console.error('Error handling charge failed:', error);
  }
}

// Handle successful transfer
async function handleTransferSuccess(data) {
  console.log('Transfer successful:', data.reference);
  // Implement refund/transfer logic here
}

// Handle failed transfer
async function handleTransferFailed(data) {
  console.log('Transfer failed:', data.reference);
  // Implement failed transfer logic here
}

module.exports = router;

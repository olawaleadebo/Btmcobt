const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel', 'car', 'activity', 'restaurant'],
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  },
  paystackReference: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
  },
  paystackResponse: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Indexes
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ paystackReference: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);

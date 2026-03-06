const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  origin: {
    type: String,
    required: true,
    uppercase: true,
  },
  destination: {
    type: String,
    required: true,
    uppercase: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    required: true,
  },
  price: {
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
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  amadeusOfferId: {
    type: String,
  },
  airline: {
    type: String,
  },
  flightNumber: {
    type: String,
  },
}, {
  timestamps: true,
});

// Generate booking reference before saving
flightSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = `FL${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Indexes for performance
flightSchema.index({ userId: 1, status: 1 });
flightSchema.index({ departureDate: 1 });
flightSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Flight', flightSchema);

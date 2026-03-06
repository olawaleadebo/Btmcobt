const mongoose = require('mongoose');

const carRentalSchema = new mongoose.Schema({
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
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  dropoffDate: {
    type: Date,
    required: true,
  },
  carType: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
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
  provider: {
    type: String,
  },
}, {
  timestamps: true,
});

// Generate booking reference
carRentalSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = `CR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Indexes
carRentalSchema.index({ userId: 1, status: 1 });
carRentalSchema.index({ pickupDate: 1 });
carRentalSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CarRental', carRentalSchema);

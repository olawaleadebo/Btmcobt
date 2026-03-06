const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
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
  restaurantName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  cuisine: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
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
  specialRequests: {
    type: String,
  },
}, {
  timestamps: true,
});

// Generate booking reference
restaurantSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = `RS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Indexes
restaurantSchema.index({ userId: 1, status: 1 });
restaurantSchema.index({ date: 1 });
restaurantSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);

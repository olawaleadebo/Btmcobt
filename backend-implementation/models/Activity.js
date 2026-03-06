const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
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
  activityName: {
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
  duration: {
    type: String,
  },
  participants: {
    type: Number,
    required: true,
    min: 1,
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
  amadeusActivityId: {
    type: String,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

// Generate booking reference
activitySchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = `AC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Indexes
activitySchema.index({ userId: 1, status: 1 });
activitySchema.index({ date: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);

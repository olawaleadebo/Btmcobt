const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
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
  hotelName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  rooms: {
    type: Number,
    required: true,
    min: 1,
  },
  roomType: {
    type: String,
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
  amadeusHotelId: {
    type: String,
  },
  amenities: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Generate booking reference
flightSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = `HT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Indexes
hotelSchema.index({ userId: 1, status: 1 });
hotelSchema.index({ checkIn: 1 });
hotelSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Hotel', hotelSchema);

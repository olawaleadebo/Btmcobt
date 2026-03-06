const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const CarRental = require('../models/CarRental');
const Activity = require('../models/Activity');
const Restaurant = require('../models/Restaurant');
const { redis } = require('../server');

// Helper to publish booking updates via Redis
const publishBookingUpdate = async (booking, userId) => {
  try {
    await redis.publish('booking_updates', JSON.stringify({
      type: 'booking_update',
      userId,
      data: booking,
      timestamp: new Date(),
    }));
  } catch (error) {
    console.error('Redis publish error:', error);
  }
};

// ============== FLIGHT BOOKINGS ==============

// @route   POST /api/bookings/flights
// @desc    Create flight booking
// @access  Private
router.post(
  '/flights',
  protect,
  [
    body('origin').trim().notEmpty().withMessage('Origin is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('departureDate').isISO8601().withMessage('Valid departure date required'),
    body('passengers').isInt({ min: 1 }).withMessage('At least 1 passenger required'),
    body('class').isIn(['economy', 'business', 'first']).withMessage('Invalid class'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const flightData = {
      ...req.body,
      userId: req.user._id,
    };

    const flight = await Flight.create(flightData);

    // Publish update via Redis/WebSocket
    await publishBookingUpdate(flight, req.user._id.toString());

    res.status(201).json({
      success: true,
      data: flight,
    });
  })
);

// @route   GET /api/bookings/flights
// @desc    Get user's flight bookings
// @access  Private
router.get(
  '/flights',
  protect,
  asyncHandler(async (req, res) => {
    const flights = await Flight.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: flights,
    });
  })
);

// ============== HOTEL BOOKINGS ==============

// @route   POST /api/bookings/hotels
// @desc    Create hotel booking
// @access  Private
router.post(
  '/hotels',
  protect,
  [
    body('hotelName').trim().notEmpty().withMessage('Hotel name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date required'),
    body('guests').isInt({ min: 1 }).withMessage('At least 1 guest required'),
    body('rooms').isInt({ min: 1 }).withMessage('At least 1 room required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const hotelData = {
      ...req.body,
      userId: req.user._id,
    };

    const hotel = await Hotel.create(hotelData);

    await publishBookingUpdate(hotel, req.user._id.toString());

    res.status(201).json({
      success: true,
      data: hotel,
    });
  })
);

// @route   GET /api/bookings/hotels
// @desc    Get user's hotel bookings
// @access  Private
router.get(
  '/hotels',
  protect,
  asyncHandler(async (req, res) => {
    const hotels = await Hotel.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: hotels,
    });
  })
);

// ============== CAR RENTAL BOOKINGS ==============

// @route   POST /api/bookings/cars
// @desc    Create car rental booking
// @access  Private
router.post(
  '/cars',
  protect,
  [
    body('pickupLocation').trim().notEmpty().withMessage('Pickup location is required'),
    body('dropoffLocation').trim().notEmpty().withMessage('Dropoff location is required'),
    body('pickupDate').isISO8601().withMessage('Valid pickup date required'),
    body('dropoffDate').isISO8601().withMessage('Valid dropoff date required'),
    body('carType').trim().notEmpty().withMessage('Car type is required'),
    body('carModel').trim().notEmpty().withMessage('Car model is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const carData = {
      ...req.body,
      userId: req.user._id,
    };

    const car = await CarRental.create(carData);

    await publishBookingUpdate(car, req.user._id.toString());

    res.status(201).json({
      success: true,
      data: car,
    });
  })
);

// @route   GET /api/bookings/cars
// @desc    Get user's car rental bookings
// @access  Private
router.get(
  '/cars',
  protect,
  asyncHandler(async (req, res) => {
    const cars = await CarRental.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: cars,
    });
  })
);

// ============== ACTIVITY BOOKINGS ==============

// @route   POST /api/bookings/activities
// @desc    Create activity booking
// @access  Private
router.post(
  '/activities',
  protect,
  [
    body('activityName').trim().notEmpty().withMessage('Activity name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('participants').isInt({ min: 1 }).withMessage('At least 1 participant required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const activityData = {
      ...req.body,
      userId: req.user._id,
    };

    const activity = await Activity.create(activityData);

    await publishBookingUpdate(activity, req.user._id.toString());

    res.status(201).json({
      success: true,
      data: activity,
    });
  })
);

// @route   GET /api/bookings/activities
// @desc    Get user's activity bookings
// @access  Private
router.get(
  '/activities',
  protect,
  asyncHandler(async (req, res) => {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities,
    });
  })
);

// ============== RESTAURANT BOOKINGS ==============

// @route   POST /api/bookings/restaurants
// @desc    Create restaurant booking
// @access  Private
router.post(
  '/restaurants',
  protect,
  [
    body('restaurantName').trim().notEmpty().withMessage('Restaurant name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('guests').isInt({ min: 1 }).withMessage('At least 1 guest required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const restaurantData = {
      ...req.body,
      userId: req.user._id,
    };

    const restaurant = await Restaurant.create(restaurantData);

    await publishBookingUpdate(restaurant, req.user._id.toString());

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  })
);

// @route   GET /api/bookings/restaurants
// @desc    Get user's restaurant bookings
// @access  Private
router.get(
  '/restaurants',
  protect,
  asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: restaurants,
    });
  })
);

// ============== ALL BOOKINGS ==============

// @route   GET /api/bookings/all
// @desc    Get all user's bookings
// @access  Private
router.get(
  '/all',
  protect,
  asyncHandler(async (req, res) => {
    const [flights, hotels, cars, activities, restaurants] = await Promise.all([
      Flight.find({ userId: req.user._id }).sort({ createdAt: -1 }),
      Hotel.find({ userId: req.user._id }).sort({ createdAt: -1 }),
      CarRental.find({ userId: req.user._id }).sort({ createdAt: -1 }),
      Activity.find({ userId: req.user._id }).sort({ createdAt: -1 }),
      Restaurant.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      data: {
        flights,
        hotels,
        cars,
        activities,
        restaurants,
      },
    });
  })
);

// ============== UPDATE & DELETE ==============

// @route   PUT /api/bookings/:type/:id
// @desc    Update booking status
// @access  Private
router.put(
  '/:type/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { type, id } = req.params;
    const { status } = req.body;

    let Model;
    switch (type) {
      case 'flights': Model = Flight; break;
      case 'hotels': Model = Hotel; break;
      case 'cars': Model = CarRental; break;
      case 'activities': Model = Activity; break;
      case 'restaurants': Model = Restaurant; break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid booking type',
        });
    }

    const booking = await Model.findOne({ _id: id, userId: req.user._id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    booking.status = status;
    await booking.save();

    await publishBookingUpdate(booking, req.user._id.toString());

    res.json({
      success: true,
      data: booking,
    });
  })
);

// @route   DELETE /api/bookings/:type/:id
// @desc    Cancel/delete booking
// @access  Private
router.delete(
  '/:type/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { type, id } = req.params;

    let Model;
    switch (type) {
      case 'flights': Model = Flight; break;
      case 'hotels': Model = Hotel; break;
      case 'cars': Model = CarRental; break;
      case 'activities': Model = Activity; break;
      case 'restaurants': Model = Restaurant; break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid booking type',
        });
    }

    const booking = await Model.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  })
);

module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validation');
const amadeusService = require('../services/amadeusService');
const { redis } = require('../server');

// Cache duration: 5 minutes
const CACHE_DURATION = 300;

// Helper function to get cached data
const getCachedData = async (key) => {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

// Helper function to set cached data
const setCachedData = async (key, data, duration = CACHE_DURATION) => {
  try {
    await redis.setex(key, duration, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

// @route   POST /api/amadeus/flights/search
// @desc    Search for flights using Amadeus API
// @access  Private
router.post(
  '/flights/search',
  protect,
  [
    body('originLocationCode').trim().isLength({ min: 3, max: 3 }).withMessage('Valid origin code required (3 letters)'),
    body('destinationLocationCode').trim().isLength({ min: 3, max: 3 }).withMessage('Valid destination code required (3 letters)'),
    body('departureDate').isISO8601().withMessage('Valid departure date required (YYYY-MM-DD)'),
    body('returnDate').optional().isISO8601().withMessage('Valid return date required (YYYY-MM-DD)'),
    body('adults').isInt({ min: 1, max: 9 }).withMessage('Adults must be between 1 and 9'),
    body('travelClass').optional().isIn(['economy', 'business', 'first']).withMessage('Invalid travel class'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const params = req.body;
    
    // Create cache key
    const cacheKey = `flights:${JSON.stringify(params)}`;
    
    // Check cache
    const cachedResults = await getCachedData(cacheKey);
    if (cachedResults) {
      console.log('✅ Returning cached flight results');
      return res.json({
        success: true,
        data: cachedResults,
        cached: true,
      });
    }

    // Call Amadeus API
    const flights = await amadeusService.searchFlights(params);
    
    // Cache results
    await setCachedData(cacheKey, flights);

    res.json({
      success: true,
      data: flights,
      cached: false,
    });
  })
);

// @route   POST /api/amadeus/hotels/search
// @desc    Search for hotels using Amadeus API
// @access  Private
router.post(
  '/hotels/search',
  protect,
  [
    body('cityCode').trim().isLength({ min: 3, max: 3 }).withMessage('Valid city code required (3 letters)'),
    body('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    body('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const params = req.body;
    
    // Create cache key
    const cacheKey = `hotels:${JSON.stringify(params)}`;
    
    // Check cache
    const cachedResults = await getCachedData(cacheKey);
    if (cachedResults) {
      console.log('✅ Returning cached hotel results');
      return res.json({
        success: true,
        data: cachedResults,
        cached: true,
      });
    }

    // Call Amadeus API
    const hotels = await amadeusService.searchHotels(params);
    
    // Cache results
    await setCachedData(cacheKey, hotels);

    res.json({
      success: true,
      data: hotels,
      cached: false,
    });
  })
);

// @route   POST /api/amadeus/cars/search
// @desc    Search for car rentals using Amadeus API
// @access  Private
router.post(
  '/cars/search',
  protect,
  [
    body('pickupLocationCode').trim().isLength({ min: 3, max: 3 }).withMessage('Valid pickup location required'),
    body('pickupDate').notEmpty().withMessage('Pickup date required'),
    body('dropOffDate').notEmpty().withMessage('Drop-off date required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const params = req.body;
    
    // Create cache key
    const cacheKey = `cars:${JSON.stringify(params)}`;
    
    // Check cache
    const cachedResults = await getCachedData(cacheKey);
    if (cachedResults) {
      console.log('✅ Returning cached car rental results');
      return res.json({
        success: true,
        data: cachedResults,
        cached: true,
      });
    }

    // Call Amadeus API
    const cars = await amadeusService.searchCarRentals(params);
    
    // Cache results
    await setCachedData(cacheKey, cars);

    res.json({
      success: true,
      data: cars,
      cached: false,
    });
  })
);

// @route   POST /api/amadeus/activities/search
// @desc    Search for activities using Amadeus API
// @access  Private
router.post(
  '/activities/search',
  protect,
  [
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Valid date required'),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { location, date } = req.body;
    
    // Create cache key
    const cacheKey = `activities:${location}:${date}`;
    
    // Check cache
    const cachedResults = await getCachedData(cacheKey);
    if (cachedResults) {
      console.log('✅ Returning cached activity results');
      return res.json({
        success: true,
        data: cachedResults,
        cached: true,
      });
    }

    // Call Amadeus API
    const activities = await amadeusService.searchActivities(location, date);
    
    // Cache results
    await setCachedData(cacheKey, activities);

    res.json({
      success: true,
      data: activities,
      cached: false,
    });
  })
);

module.exports = router;

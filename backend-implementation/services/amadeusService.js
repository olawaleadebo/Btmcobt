const Amadeus = require('amadeus');

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: process.env.AMADEUS_ENV === 'production' ? 'production' : 'test',
});

// Search for flights
exports.searchFlights = async (params) => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults || 1,
      travelClass: params.travelClass,
      max: params.max || 10,
    });

    // Transform Amadeus response to our format
    const flights = response.data.map(offer => ({
      id: offer.id,
      origin: params.originLocationCode,
      destination: params.destinationLocationCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      airline: offer.validatingAirlineCodes[0],
      flightNumber: offer.itineraries[0]?.segments[0]?.number || 'N/A',
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      class: params.travelClass || 'economy',
      duration: offer.itineraries[0]?.duration,
      numberOfStops: offer.itineraries[0]?.segments?.length - 1 || 0,
      rawData: offer, // Store full Amadeus response
    }));

    return flights;
  } catch (error) {
    console.error('Amadeus Flight Search Error:', error.response?.data || error.message);
    throw new Error(`Flight search failed: ${error.description || error.message}`);
  }
};

// Search for hotels
exports.searchHotels = async (params) => {
  try {
    // First, get hotel list by city
    const hotelListResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: params.cityCode,
    });

    if (!hotelListResponse.data || hotelListResponse.data.length === 0) {
      return [];
    }

    // Get hotel IDs (limit to first 10 for performance)
    const hotelIds = hotelListResponse.data.slice(0, 10).map(hotel => hotel.hotelId);

    // Search for hotel offers
    const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds.join(','),
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults || 1,
    });

    // Transform response
    const hotels = offersResponse.data.map(offer => ({
      id: offer.hotel.hotelId,
      name: offer.hotel.name,
      location: params.cityCode,
      rating: offer.hotel.rating || 0,
      price: parseFloat(offer.offers[0]?.price?.total || 0),
      currency: offer.offers[0]?.price?.currency || 'USD',
      amenities: offer.hotel.amenities || [],
      description: offer.hotel.description?.text || '',
      rawData: offer,
    }));

    return hotels;
  } catch (error) {
    console.error('Amadeus Hotel Search Error:', error.response?.data || error.message);
    throw new Error(`Hotel search failed: ${error.description || error.message}`);
  }
};

// Search for car rentals
exports.searchCarRentals = async (params) => {
  try {
    const response = await amadeus.shopping.carRentals.get({
      pickUpLocationCode: params.pickupLocationCode,
      pickUpDate: params.pickupDate,
      dropOffDate: params.dropOffDate,
      dropOffLocationCode: params.dropOffLocationCode || params.pickupLocationCode,
    });

    // Transform response
    const cars = response.data.map(offer => ({
      id: offer.id,
      model: offer.vehicle.model || 'Standard Car',
      type: offer.vehicle.category || 'Economy',
      provider: offer.provider.name,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      perDay: true,
      rawData: offer,
    }));

    return cars;
  } catch (error) {
    console.error('Amadeus Car Rental Search Error:', error.response?.data || error.message);
    throw new Error(`Car rental search failed: ${error.description || error.message}`);
  }
};

// Search for activities
exports.searchActivities = async (location, date) => {
  try {
    // First, get location coordinates
    const locationResponse = await amadeus.referenceData.locations.get({
      keyword: location,
      subType: 'CITY',
    });

    if (!locationResponse.data || locationResponse.data.length === 0) {
      return [];
    }

    const { latitude, longitude } = locationResponse.data[0].geoCode;

    // Search for activities
    const response = await amadeus.shopping.activities.get({
      latitude,
      longitude,
      radius: 20, // 20km radius
    });

    // Transform response
    const activities = response.data.map(activity => ({
      id: activity.id,
      name: activity.name,
      location,
      duration: activity.duration || 'N/A',
      price: parseFloat(activity.price?.amount || 35),
      currency: activity.price?.currencyCode || 'USD',
      description: activity.description || activity.shortDescription || '',
      rating: activity.rating || 0,
      images: activity.pictures || [],
      rawData: activity,
    }));

    return activities;
  } catch (error) {
    console.error('Amadeus Activity Search Error:', error.response?.data || error.message);
    throw new Error(`Activity search failed: ${error.description || error.message}`);
  }
};

// Get flight price analysis (optional advanced feature)
exports.getFlightPriceAnalysis = async (params) => {
  try {
    const response = await amadeus.analytics.itineraryPriceMetrics.get({
      originIataCode: params.origin,
      destinationIataCode: params.destination,
      departureDate: params.departureDate,
    });

    return response.data;
  } catch (error) {
    console.error('Amadeus Price Analysis Error:', error.response?.data || error.message);
    return null; // Return null if not available
  }
};

module.exports = exports;

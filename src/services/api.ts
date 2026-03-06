import axios from 'axios';
import type {
  User,
  Flight,
  Hotel,
  CarRental,
  Activity,
  Restaurant,
  Payment,
  AmadeusFlightSearchParams,
  AmadeusHotelSearchParams,
  AmadeusCarRentalParams,
  PaystackPaymentData,
} from '../types';

// Configure your backend API URL here
// TODO: Replace with your actual backend URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend may be offline');
      throw new Error('Unable to connect to server. Please check your connection.');
    }

    // Return structured error
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
);

// ===========================================
// AUTH API - Connect to your MongoDB backend
// ===========================================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: Partial<User> & { password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    await api.post('/auth/logout');
  },
};

// ===========================================
// AMADEUS API - Flight Search & Booking
// ===========================================
export const amadeusAPI = {
  // Search flights using Amadeus Flight Offers Search API
  searchFlights: async (params: AmadeusFlightSearchParams) => {
    const response = await api.post('/amadeus/flights/search', params);
    return response.data;
  },

  // Search hotels using Amadeus Hotel Search API
  searchHotels: async (params: AmadeusHotelSearchParams) => {
    const response = await api.post('/amadeus/hotels/search', params);
    return response.data;
  },

  // Search car rentals using Amadeus
  searchCarRentals: async (params: AmadeusCarRentalParams) => {
    const response = await api.post('/amadeus/cars/search', params);
    return response.data;
  },

  // Search activities
  searchActivities: async (location: string, date: string) => {
    const response = await api.post('/amadeus/activities/search', { location, date });
    return response.data;
  },
};

// ===========================================
// BOOKING API - MongoDB CRUD Operations
// ===========================================
export const bookingAPI = {
  // Flights
  createFlightBooking: async (flightData: Partial<Flight>) => {
    const response = await api.post('/bookings/flights', flightData);
    return response.data;
  },

  getFlightBookings: async (userId: string) => {
    const response = await api.get(`/bookings/flights?userId=${userId}`);
    return response.data;
  },

  // Hotels
  createHotelBooking: async (hotelData: Partial<Hotel>) => {
    const response = await api.post('/bookings/hotels', hotelData);
    return response.data;
  },

  getHotelBookings: async (userId: string) => {
    const response = await api.get(`/bookings/hotels?userId=${userId}`);
    return response.data;
  },

  // Cars
  createCarBooking: async (carData: Partial<CarRental>) => {
    const response = await api.post('/bookings/cars', carData);
    return response.data;
  },

  getCarBookings: async (userId: string) => {
    const response = await api.get(`/bookings/cars?userId=${userId}`);
    return response.data;
  },

  // Activities
  createActivityBooking: async (activityData: Partial<Activity>) => {
    const response = await api.post('/bookings/activities', activityData);
    return response.data;
  },

  getActivityBookings: async (userId: string) => {
    const response = await api.get(`/bookings/activities?userId=${userId}`);
    return response.data;
  },

  // Restaurants
  createRestaurantBooking: async (restaurantData: Partial<Restaurant>) => {
    const response = await api.post('/bookings/restaurants', restaurantData);
    return response.data;
  },

  getRestaurantBookings: async (userId: string) => {
    const response = await api.get(`/bookings/restaurants?userId=${userId}`);
    return response.data;
  },

  // Get all bookings
  getAllBookings: async (userId: string) => {
    const response = await api.get(`/bookings/all?userId=${userId}`);
    return response.data;
  },
};

// ===========================================
// PAYSTACK PAYMENT API
// ===========================================
export const paystackAPI = {
  // Initialize payment
  initializePayment: async (paymentData: PaystackPaymentData) => {
    const response = await api.post('/payments/initialize', paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (reference: string) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },

  // Create payment record in MongoDB
  createPaymentRecord: async (paymentData: Partial<Payment>) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
};

// ===========================================
// EMAIL API - SMTP Integration
// ===========================================
export const emailAPI = {
  sendBookingConfirmation: async (bookingId: string, userEmail: string) => {
    await api.post('/emails/booking-confirmation', { bookingId, userEmail });
    return { success: true };
  },

  sendPaymentReceipt: async (paymentId: string, userEmail: string) => {
    await api.post('/emails/payment-receipt', { paymentId, userEmail });
    return { success: true };
  },
};

export default api;
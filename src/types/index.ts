// TypeScript interfaces for MongoDB collections and Amadeus API responses

export interface User {
  _id: string;
  email: string;
  name: string;
  company: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flight {
  _id: string;
  userId: string;
  bookingReference: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amadeusOfferId?: string;
  airline: string;
  flightNumber: string;
  createdAt: Date;
}

export interface Hotel {
  _id: string;
  userId: string;
  bookingReference: string;
  hotelName: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  roomType: string;
  price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amadeusHotelId?: string;
  amenities: string[];
  createdAt: Date;
}

export interface CarRental {
  _id: string;
  userId: string;
  bookingReference: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  carType: string;
  carModel: string;
  price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amadeusOfferId?: string;
  provider: string;
  createdAt: Date;
}

export interface Activity {
  _id: string;
  userId: string;
  bookingReference: string;
  activityName: string;
  location: string;
  date: Date;
  duration: string;
  participants: number;
  price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amadeusActivityId?: string;
  description: string;
  createdAt: Date;
}

export interface Restaurant {
  _id: string;
  userId: string;
  bookingReference: string;
  restaurantName: string;
  location: string;
  date: Date;
  time: string;
  guests: number;
  cuisine: string;
  price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: Date;
}

export interface Payment {
  _id: string;
  userId: string;
  bookingType: 'flight' | 'hotel' | 'car' | 'activity' | 'restaurant';
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed';
  paystackReference: string;
  paymentMethod: string;
  createdAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'booking' | 'payment' | 'reminder' | 'update';
  title: string;
  message: string;
  read: boolean;
  bookingReference?: string;
  createdAt: Date;
}

// Amadeus API Request/Response types
export interface AmadeusFlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass?: string;
  max?: number;
}

export interface AmadeusHotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  radius?: number;
  radiusUnit?: string;
}

export interface AmadeusCarRentalParams {
  pickupLocationCode: string;
  pickupDate: string;
  dropOffDate: string;
  dropOffLocationCode?: string;
}

// Paystack payment types
export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo
  reference: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    status: 'success' | 'failed';
    reference: string;
    amount: number;
    currency: string;
    transaction_date: string;
  };
}

// WebSocket event types
export interface WebSocketEvent {
  type: 'booking_update' | 'payment_update' | 'notification' | 'price_change';
  data: any;
  timestamp: Date;
}

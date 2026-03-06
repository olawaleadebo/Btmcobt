# API Endpoints Reference Guide

Quick reference for all backend endpoints your COBT frontend expects.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-domain.com/api
```

---

## 🔐 Authentication Endpoints

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "securepassword123",
  "name": "John Doe",
  "company": "Tech Corp",
  "role": "user"
}

Response: 201 Created
{
  "user": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "email": "user@company.com",
    "name": "John Doe",
    "company": "Tech Corp",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout User
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true
}
```

---

## ✈️ Amadeus API Endpoints

### Search Flights
```http
POST /api/amadeus/flights/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "originLocationCode": "JFK",
  "destinationLocationCode": "LHR",
  "departureDate": "2026-04-15",
  "returnDate": "2026-04-22",
  "adults": 1,
  "travelClass": "economy",
  "max": 10
}

Response: 200 OK
[
  {
    "id": "flight-offer-1",
    "origin": "JFK",
    "destination": "LHR",
    "airline": "British Airways",
    "flightNumber": "BA112",
    "price": 650.00,
    "currency": "USD",
    "duration": "7h 30m",
    "class": "economy"
  },
  ...
]
```

### Search Hotels
```http
POST /api/amadeus/hotels/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "cityCode": "LON",
  "checkInDate": "2026-04-15",
  "checkOutDate": "2026-04-20",
  "adults": 2
}

Response: 200 OK
[
  {
    "id": "hotel-1",
    "name": "The Savoy London",
    "location": "London",
    "rating": 4.8,
    "price": 350.00,
    "currency": "USD",
    "amenities": ["WiFi", "Pool", "Spa", "Restaurant"]
  },
  ...
]
```

### Search Car Rentals
```http
POST /api/amadeus/cars/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "pickupLocationCode": "LHR",
  "pickupDate": "2026-04-15T10:00:00",
  "dropOffDate": "2026-04-20T10:00:00",
  "dropOffLocationCode": "LHR"
}

Response: 200 OK
[
  {
    "id": "car-1",
    "model": "BMW 5 Series",
    "type": "Sedan",
    "provider": "Hertz",
    "price": 85.00,
    "currency": "USD",
    "perDay": true
  },
  ...
]
```

### Search Activities
```http
POST /api/amadeus/activities/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "location": "London",
  "date": "2026-04-16"
}

Response: 200 OK
[
  {
    "id": "activity-1",
    "name": "London Eye Experience",
    "location": "London",
    "duration": "1 hour",
    "price": 35.00,
    "currency": "USD",
    "description": "Take a ride on the iconic London Eye"
  },
  ...
]
```

---

## 📅 Booking Endpoints

### Create Flight Booking
```http
POST /api/bookings/flights
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "origin": "JFK",
  "destination": "LHR",
  "departureDate": "2026-04-15T14:30:00Z",
  "returnDate": "2026-04-22T16:00:00Z",
  "passengers": 1,
  "class": "economy",
  "price": 650.00,
  "currency": "USD",
  "amadeusOfferId": "flight-offer-1",
  "airline": "British Airways",
  "flightNumber": "BA112"
}

Response: 201 Created
{
  "_id": "60d5ec49f1b2c8b1f8e4e1a2",
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "bookingReference": "FL1234567890",
  "status": "pending",
  "origin": "JFK",
  "destination": "LHR",
  ...
  "createdAt": "2026-03-06T10:30:00Z"
}
```

### Get User's Flight Bookings
```http
GET /api/bookings/flights?userId=60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "60d5ec49f1b2c8b1f8e4e1a2",
    "bookingReference": "FL1234567890",
    "status": "confirmed",
    ...
  },
  ...
]
```

### Create Hotel Booking
```http
POST /api/bookings/hotels
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "hotelName": "The Savoy London",
  "location": "London",
  "checkIn": "2026-04-15",
  "checkOut": "2026-04-20",
  "guests": 2,
  "rooms": 1,
  "roomType": "Deluxe Suite",
  "price": 1750.00,
  "currency": "USD",
  "amadeusHotelId": "hotel-1",
  "amenities": ["WiFi", "Pool", "Spa"]
}

Response: 201 Created
{
  "_id": "60d5ec49f1b2c8b1f8e4e1a3",
  "bookingReference": "HT1234567890",
  ...
}
```

### Get User's Hotel Bookings
```http
GET /api/bookings/hotels?userId=60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer {token}

Response: 200 OK
[...]
```

### Create Car Rental Booking
```http
POST /api/bookings/cars
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "pickupLocation": "LHR",
  "dropoffLocation": "LHR",
  "pickupDate": "2026-04-15T10:00:00Z",
  "dropoffDate": "2026-04-20T10:00:00Z",
  "carType": "Sedan",
  "carModel": "BMW 5 Series",
  "price": 425.00,
  "currency": "USD",
  "amadeusOfferId": "car-1",
  "provider": "Hertz"
}

Response: 201 Created
{
  "_id": "60d5ec49f1b2c8b1f8e4e1a4",
  "bookingReference": "CR1234567890",
  ...
}
```

### Get User's Car Bookings
```http
GET /api/bookings/cars?userId=60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer {token}

Response: 200 OK
[...]
```

### Create Activity Booking
```http
POST /api/bookings/activities
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "activityName": "London Eye Experience",
  "location": "London",
  "date": "2026-04-16",
  "duration": "1 hour",
  "participants": 2,
  "price": 70.00,
  "currency": "USD",
  "amadeusActivityId": "activity-1",
  "description": "Take a ride on the iconic London Eye"
}

Response: 201 Created
{
  "_id": "60d5ec49f1b2c8b1f8e4e1a5",
  "bookingReference": "AC1234567890",
  ...
}
```

### Get User's Activity Bookings
```http
GET /api/bookings/activities?userId=60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer {token}

Response: 200 OK
[...]
```

### Create Restaurant Reservation
```http
POST /api/bookings/restaurants
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "restaurantName": "Gordon Ramsay Restaurant",
  "location": "London",
  "date": "2026-04-16",
  "time": "19:30",
  "guests": 4,
  "cuisine": "French",
  "price": 0,
  "currency": "USD",
  "specialRequests": "Window table preferred"
}

Response: 201 Created
{
  "_id": "60d5ec49f1b2c8b1f8e4e1a6",
  "bookingReference": "RS1234567890",
  ...
}
```

### Get User's Restaurant Bookings
```http
GET /api/bookings/restaurants?userId=60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer {token}

Response: 200 OK
[...]
```

### Get All Bookings
```http
GET /api/bookings/all?userId=60d5ec49f1b2c8b1f8e4e1a1
Authorization: Bearer {token}

Response: 200 OK
{
  "flights": [...],
  "hotels": [...],
  "cars": [...],
  "activities": [...],
  "restaurants": [...]
}
```

---

## 💳 Payment Endpoints

### Initialize Payment
```http
POST /api/payments/initialize
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "user@company.com",
  "amount": 65000,
  "reference": "flight-60d5ec49f1b2c8b1f8e4e1a2-1709720400000",
  "currency": "USD",
  "metadata": {
    "bookingId": "60d5ec49f1b2c8b1f8e4e1a2",
    "bookingType": "flight",
    "userId": "60d5ec49f1b2c8b1f8e4e1a1"
  }
}

Response: 200 OK
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/xxxxxxxxx",
    "access_code": "xxxxxxxxx",
    "reference": "flight-60d5ec49f1b2c8b1f8e4e1a2-1709720400000"
  }
}
```

### Verify Payment
```http
GET /api/payments/verify/flight-60d5ec49f1b2c8b1f8e4e1a2-1709720400000
Authorization: Bearer {token}

Response: 200 OK
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "status": "success",
    "reference": "flight-60d5ec49f1b2c8b1f8e4e1a2-1709720400000",
    "amount": 65000,
    "currency": "USD",
    "transaction_date": "2026-03-06T10:35:00Z"
  }
}
```

### Create Payment Record
```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "60d5ec49f1b2c8b1f8e4e1a1",
  "bookingType": "flight",
  "bookingId": "60d5ec49f1b2c8b1f8e4e1a2",
  "amount": 650.00,
  "currency": "USD",
  "status": "successful",
  "paystackReference": "flight-60d5ec49f1b2c8b1f8e4e1a2-1709720400000",
  "paymentMethod": "card"
}

Response: 201 Created
{
  "_id": "60d5ec49f1b2c8b1f8e4e1a7",
  ...
}
```

---

## 📧 Email Endpoints

### Send Booking Confirmation
```http
POST /api/emails/booking-confirmation
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "60d5ec49f1b2c8b1f8e4e1a2",
  "userEmail": "user@company.com"
}

Response: 200 OK
{
  "success": true
}
```

### Send Payment Receipt
```http
POST /api/emails/payment-receipt
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentId": "60d5ec49f1b2c8b1f8e4e1a7",
  "userEmail": "user@company.com"
}

Response: 200 OK
{
  "success": true
}
```

---

## 🔌 WebSocket Events

### Client → Server

```javascript
// Subscribe to user-specific events
socket.emit('subscribe', userId);
```

### Server → Client

```javascript
// Booking update event
{
  type: 'booking_update',
  userId: '60d5ec49f1b2c8b1f8e4e1a1',
  data: {
    bookingId: '60d5ec49f1b2c8b1f8e4e1a2',
    status: 'confirmed',
    ...
  },
  timestamp: '2026-03-06T10:40:00Z'
}

// Payment update event
{
  type: 'payment_update',
  userId: '60d5ec49f1b2c8b1f8e4e1a1',
  data: {
    paymentId: '60d5ec49f1b2c8b1f8e4e1a7',
    status: 'successful',
    ...
  },
  timestamp: '2026-03-06T10:41:00Z'
}

// Notification event
{
  type: 'notification',
  userId: '60d5ec49f1b2c8b1f8e4e1a1',
  data: {
    title: 'Booking Confirmed',
    message: 'Your flight booking has been confirmed',
    bookingReference: 'FL1234567890'
  },
  timestamp: '2026-03-06T10:42:00Z'
}

// Price change event (broadcast to all users)
{
  type: 'price_change',
  data: {
    type: 'flight',
    route: 'JFK-LHR',
    oldPrice: 650.00,
    newPrice: 590.00,
    currency: 'USD'
  },
  timestamp: '2026-03-06T10:43:00Z'
}
```

---

## 🔒 Authentication Header

All protected endpoints require:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "message": "Booking not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## 📊 Rate Limiting

Recommended rate limits for your backend:

- Authentication endpoints: 5 requests per minute
- Search endpoints: 10 requests per minute
- Booking endpoints: 20 requests per minute
- General endpoints: 100 requests per minute

---

## 🧪 Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User","company":"Test Corp","role":"user"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Search Flights (replace TOKEN)
curl -X POST http://localhost:5000/api/amadeus/flights/search \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"originLocationCode":"JFK","destinationLocationCode":"LHR","departureDate":"2026-04-15","adults":1}'
```

---

**Use this as your API contract reference when building the backend!** 🚀

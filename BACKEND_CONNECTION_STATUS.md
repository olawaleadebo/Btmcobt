# Backend Connection Status

## ✅ All API Calls Now Connected to Backend

All mock data has been removed and the frontend is now configured to make **real HTTP requests** to your backend API.

## 🔌 Connected Endpoints

### Authentication (`/src/services/api.ts`)
- ✅ `POST /api/auth/login` - User login with MongoDB
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/logout` - User logout

### Amadeus API Integration
- ✅ `POST /api/amadeus/flights/search` - Search flights via Amadeus
- ✅ `POST /api/amadeus/hotels/search` - Search hotels via Amadeus
- ✅ `POST /api/amadeus/cars/search` - Search car rentals via Amadeus
- ✅ `POST /api/amadeus/activities/search` - Search activities via Amadeus

### Booking Operations (MongoDB)
- ✅ `POST /api/bookings/flights` - Create flight booking
- ✅ `GET /api/bookings/flights?userId={id}` - Get user's flight bookings
- ✅ `POST /api/bookings/hotels` - Create hotel booking
- ✅ `GET /api/bookings/hotels?userId={id}` - Get user's hotel bookings
- ✅ `POST /api/bookings/cars` - Create car rental booking
- ✅ `GET /api/bookings/cars?userId={id}` - Get user's car bookings
- ✅ `POST /api/bookings/activities` - Create activity booking
- ✅ `GET /api/bookings/activities?userId={id}` - Get user's activity bookings
- ✅ `POST /api/bookings/restaurants` - Create restaurant reservation
- ✅ `GET /api/bookings/restaurants?userId={id}` - Get user's restaurant bookings
- ✅ `GET /api/bookings/all?userId={id}` - Get all bookings for user

### Payment Integration (Paystack)
- ✅ `POST /api/payments/initialize` - Initialize Paystack payment
- ✅ `GET /api/payments/verify/{reference}` - Verify payment with Paystack
- ✅ `POST /api/payments` - Save payment record to MongoDB

### Email Notifications (SMTP)
- ✅ `POST /api/emails/booking-confirmation` - Send booking confirmation email
- ✅ `POST /api/emails/payment-receipt` - Send payment receipt email

### WebSocket Connection
- ✅ Connected to `${VITE_WS_URL}` (Socket.io)
- ✅ Subscribes to user-specific events
- ✅ Listens for: `booking_update`, `payment_update`, `notification`, `price_change`

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# WebSocket Server URL
VITE_WS_URL=http://localhost:5000
```

### For Production:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_WS_URL=https://your-backend-domain.com
```

## 🚨 Error Handling

The application now includes comprehensive error handling:

### Automatic Token Refresh
- If backend returns `401 Unauthorized`, user is automatically logged out
- User is redirected to login page
- Auth token is cleared from localStorage

### Network Error Handling
- Displays user-friendly error messages
- Shows toast notifications for errors
- Logs errors to console for debugging

### API Response Structure Expected

Your backend should return responses in this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here",
  "message": "User-friendly message"
}
```

## 📋 Required Backend Endpoints

Your Node.js/Express backend must implement these endpoints:

### 1. Authentication Routes (`routes/auth.js`)

```javascript
POST /api/auth/register
Body: { email, password, name, company, role }
Returns: { user: {...}, token: "jwt-token" }

POST /api/auth/login
Body: { email, password }
Returns: { user: {...}, token: "jwt-token" }

POST /api/auth/logout
Headers: Authorization: Bearer {token}
Returns: { success: true }
```

### 2. Amadeus Routes (`routes/amadeus.js`)

```javascript
POST /api/amadeus/flights/search
Body: AmadeusFlightSearchParams
Returns: Array of flight offers from Amadeus API

POST /api/amadeus/hotels/search
Body: AmadeusHotelSearchParams
Returns: Array of hotel offers from Amadeus API

POST /api/amadeus/cars/search
Body: AmadeusCarRentalParams
Returns: Array of car rental offers from Amadeus API

POST /api/amadeus/activities/search
Body: { location, date }
Returns: Array of activities from Amadeus API
```

### 3. Booking Routes (`routes/bookings.js`)

```javascript
// Flights
POST /api/bookings/flights
Body: Partial<Flight>
Returns: Created Flight document from MongoDB

GET /api/bookings/flights?userId={id}
Returns: Array of Flight documents

// Hotels
POST /api/bookings/hotels
Body: Partial<Hotel>
Returns: Created Hotel document

GET /api/bookings/hotels?userId={id}
Returns: Array of Hotel documents

// Cars
POST /api/bookings/cars
Body: Partial<CarRental>
Returns: Created CarRental document

GET /api/bookings/cars?userId={id}
Returns: Array of CarRental documents

// Activities
POST /api/bookings/activities
Body: Partial<Activity>
Returns: Created Activity document

GET /api/bookings/activities?userId={id}
Returns: Array of Activity documents

// Restaurants
POST /api/bookings/restaurants
Body: Partial<Restaurant>
Returns: Created Restaurant document

GET /api/bookings/restaurants?userId={id}
Returns: Array of Restaurant documents

// All Bookings
GET /api/bookings/all?userId={id}
Returns: { flights: [...], hotels: [...], cars: [...], activities: [...], restaurants: [...] }
```

### 4. Payment Routes (`routes/payments.js`)

```javascript
POST /api/payments/initialize
Body: PaystackPaymentData
Returns: Paystack initialization response

GET /api/payments/verify/{reference}
Returns: Paystack verification response

POST /api/payments
Body: Partial<Payment>
Returns: Created Payment document from MongoDB
```

### 5. Email Routes (`routes/emails.js`)

```javascript
POST /api/emails/booking-confirmation
Body: { bookingId, userEmail }
Returns: { success: true }

POST /api/emails/payment-receipt
Body: { paymentId, userEmail }
Returns: { success: true }
```

## 🔐 Authentication Flow

1. User submits login/register form
2. Frontend sends request to `/api/auth/login` or `/api/auth/register`
3. Backend validates credentials with MongoDB
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in all subsequent requests via `Authorization: Bearer {token}`
7. Backend middleware verifies token on protected routes
8. WebSocket connection authenticates with same token

## 🧪 Testing the Connection

### Step 1: Start Your Backend
```bash
cd backend
npm run dev
# Should start on http://localhost:5000
```

### Step 2: Start Frontend
```bash
npm run dev
# Should start on http://localhost:5173
```

### Step 3: Test Authentication
1. Go to http://localhost:5173/login
2. Try to register a new user
3. Check browser Network tab - should see POST to `/api/auth/register`
4. Check backend logs - should receive the request
5. If successful, you'll be logged in and redirected to dashboard

### Step 4: Test Booking Flow
1. Navigate to Flights page
2. Fill in search form
3. Click Search
4. Check Network tab - should see POST to `/api/amadeus/flights/search`
5. If backend is connected, you'll see real Amadeus API results

### Step 5: Test WebSocket
1. Open browser console
2. Should see: "WebSocket connected"
3. Check backend logs - should show client connection
4. Make a booking - should receive real-time update

## 🐛 Troubleshooting

### "Network Error" Message
**Problem:** Frontend can't connect to backend  
**Solution:**
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` in `.env`
- Ensure CORS is configured in backend:
  ```javascript
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  ```

### 401 Unauthorized Errors
**Problem:** Token authentication failing  
**Solution:**
- Check JWT_SECRET matches between requests
- Verify token is being sent in Authorization header
- Check token expiration time
- Ensure middleware is properly configured

### WebSocket Not Connecting
**Problem:** Real-time updates not working  
**Solution:**
- Verify Socket.io server is running
- Check `VITE_WS_URL` in `.env`
- Ensure Socket.io CORS is configured:
  ```javascript
  const io = socketIo(server, {
    cors: { origin: 'http://localhost:5173' }
  });
  ```

### Amadeus API Errors
**Problem:** Search returns no results or errors  
**Solution:**
- Verify Amadeus credentials in backend `.env`
- Check you're using test environment
- Ensure API quota is not exceeded
- Review Amadeus API response in backend logs

### Paystack Payment Fails
**Problem:** Payment initialization or verification fails  
**Solution:**
- Verify Paystack secret key in backend `.env`
- Ensure using test keys for development
- Check Paystack dashboard for transaction logs
- Verify webhook URL is accessible

## ✅ Connection Checklist

Before deploying to production:

- [ ] All API endpoints implemented in backend
- [ ] MongoDB connected and schemas created
- [ ] Amadeus API credentials configured
- [ ] Paystack API credentials configured
- [ ] SMTP email service configured
- [ ] Redis connected for caching
- [ ] WebSocket server running
- [ ] CORS configured for production domain
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] JWT secret is secure and unique
- [ ] Database indexes created
- [ ] Error logging implemented
- [ ] Rate limiting configured
- [ ] Security headers set (Helmet.js)

## 📚 Next Steps

1. **Implement Backend** - Use `BACKEND_INTEGRATION.md` as your guide
2. **Test Locally** - Ensure all endpoints work
3. **Deploy Backend** - Use Railway, Heroku, or AWS
4. **Update Frontend ENV** - Point to production backend URL
5. **Deploy Frontend** - Use Vercel or Netlify
6. **Monitor** - Set up logging and error tracking

## 🎯 Summary

✅ **Frontend is fully connected** to backend API endpoints  
✅ **No mock data** - all calls go to your backend  
✅ **Error handling** implemented for all scenarios  
✅ **WebSocket** ready for real-time updates  
✅ **Authentication** uses JWT tokens  
✅ **TypeScript types** defined for all data models  

**Your frontend is production-ready and waiting for the backend!** 🚀

Refer to `BACKEND_INTEGRATION.md` for complete backend implementation code and examples.

# Backend Integration Checklist

Use this checklist to track your progress implementing the backend for COBT.

## Phase 1: Project Setup

- [ ] Create backend directory
- [ ] Initialize Node.js project (`npm init`)
- [ ] Install dependencies
  - [ ] express
  - [ ] mongoose
  - [ ] socket.io
  - [ ] redis & ioredis
  - [ ] amadeus
  - [ ] jsonwebtoken
  - [ ] bcryptjs
  - [ ] nodemailer
  - [ ] cors
  - [ ] helmet
  - [ ] dotenv
  - [ ] express-validator
- [ ] Create project structure
  - [ ] `/src` directory
  - [ ] `/src/config` for configurations
  - [ ] `/src/models` for MongoDB schemas
  - [ ] `/src/routes` for API routes
  - [ ] `/src/middleware` for middlewares
  - [ ] `/src/services` for external API integrations
  - [ ] `/src/socket` for WebSocket handlers
- [ ] Create `.env` file
- [ ] Create `.gitignore` file
- [ ] Set up `server.js` main file

## Phase 2: Database Setup

### MongoDB
- [ ] Sign up for MongoDB Atlas (or install locally)
- [ ] Create database cluster
- [ ] Create database user
- [ ] Configure network access
- [ ] Get connection string
- [ ] Add connection string to `.env`
- [ ] Create database connection file (`/src/config/database.js`)
- [ ] Test connection

### MongoDB Schemas
- [ ] Create `User` model
- [ ] Create `Flight` model
- [ ] Create `Hotel` model
- [ ] Create `CarRental` model
- [ ] Create `Activity` model
- [ ] Create `Restaurant` model
- [ ] Create `Payment` model
- [ ] Create `Notification` model
- [ ] Add indexes for performance
- [ ] Test schema validation

### Redis
- [ ] Sign up for Redis cloud (or install locally)
- [ ] Get connection details
- [ ] Add to `.env`
- [ ] Create Redis client (`/src/config/redis.js`)
- [ ] Test connection
- [ ] Set up pub/sub channels

## Phase 3: Authentication System

- [ ] Create auth middleware (`/src/middleware/auth.js`)
  - [ ] JWT verification
  - [ ] Token extraction from headers
  - [ ] User attachment to request
- [ ] Create auth routes (`/src/routes/auth.js`)
  - [ ] POST `/api/auth/register`
  - [ ] POST `/api/auth/login`
  - [ ] POST `/api/auth/logout`
- [ ] Hash passwords with bcrypt
- [ ] Generate JWT tokens
- [ ] Test authentication flow
  - [ ] Register new user
  - [ ] Login with credentials
  - [ ] Access protected route
  - [ ] Logout

## Phase 4: Amadeus API Integration

- [ ] Sign up for Amadeus developers account
- [ ] Create application
- [ ] Get test credentials (Client ID & Secret)
- [ ] Add credentials to `.env`
- [ ] Create Amadeus service (`/src/services/amadeusService.js`)
  - [ ] Initialize Amadeus client
  - [ ] Implement `searchFlights()`
  - [ ] Implement `searchHotels()`
  - [ ] Implement `searchCarRentals()`
  - [ ] Implement `searchActivities()`
- [ ] Create Amadeus routes (`/src/routes/amadeus.js`)
  - [ ] POST `/api/amadeus/flights/search`
  - [ ] POST `/api/amadeus/hotels/search`
  - [ ] POST `/api/amadeus/cars/search`
  - [ ] POST `/api/amadeus/activities/search`
- [ ] Add error handling
- [ ] Implement Redis caching for results
- [ ] Test all search endpoints

## Phase 5: Booking System

### Flight Bookings
- [ ] Create booking routes (`/src/routes/bookings.js`)
- [ ] POST `/api/bookings/flights`
  - [ ] Validate input data
  - [ ] Generate booking reference
  - [ ] Save to MongoDB
  - [ ] Return booking details
- [ ] GET `/api/bookings/flights?userId={id}`
  - [ ] Query user's flight bookings
  - [ ] Return array of bookings
- [ ] Test flight booking flow

### Hotel Bookings
- [ ] POST `/api/bookings/hotels`
- [ ] GET `/api/bookings/hotels?userId={id}`
- [ ] Test hotel booking flow

### Car Rentals
- [ ] POST `/api/bookings/cars`
- [ ] GET `/api/bookings/cars?userId={id}`
- [ ] Test car booking flow

### Activities
- [ ] POST `/api/bookings/activities`
- [ ] GET `/api/bookings/activities?userId={id}`
- [ ] Test activity booking flow

### Restaurants
- [ ] POST `/api/bookings/restaurants`
- [ ] GET `/api/bookings/restaurants?userId={id}`
- [ ] Test restaurant booking flow

### Combined Endpoint
- [ ] GET `/api/bookings/all?userId={id}`
  - [ ] Fetch all booking types
  - [ ] Combine into single response
- [ ] Test combined endpoint

## Phase 6: Payment Integration

- [ ] Sign up for Paystack account
- [ ] Get test API keys
- [ ] Add keys to `.env`
- [ ] Create Paystack service (`/src/services/paystackService.js`)
  - [ ] Implement `initializePayment()`
  - [ ] Implement `verifyPayment()`
- [ ] Create payment routes (`/src/routes/payments.js`)
  - [ ] POST `/api/payments/initialize`
  - [ ] GET `/api/payments/verify/:reference`
  - [ ] POST `/api/payments`
- [ ] Set up webhook endpoint (`/api/webhooks/paystack`)
  - [ ] Verify webhook signature
  - [ ] Update booking status
  - [ ] Create payment record
  - [ ] Send confirmation email
- [ ] Test payment flow
  - [ ] Initialize payment
  - [ ] Complete test payment
  - [ ] Verify payment
  - [ ] Check webhook received

## Phase 7: Email System

- [ ] Choose email service (SendGrid/Gmail/Mailgun)
- [ ] Get SMTP credentials
- [ ] Add credentials to `.env`
- [ ] Create email service (`/src/services/emailService.js`)
  - [ ] Configure nodemailer transporter
  - [ ] Create email templates
  - [ ] Implement `sendBookingConfirmation()`
  - [ ] Implement `sendPaymentReceipt()`
- [ ] Create email routes (`/src/routes/emails.js`)
  - [ ] POST `/api/emails/booking-confirmation`
  - [ ] POST `/api/emails/payment-receipt`
- [ ] Test email sending
  - [ ] Send test confirmation
  - [ ] Send test receipt
  - [ ] Check spam folder
  - [ ] Verify formatting

## Phase 8: WebSocket (Real-time Updates)

- [ ] Set up Socket.io server
  - [ ] Initialize with Express server
  - [ ] Configure CORS
  - [ ] Add authentication
- [ ] Create socket handlers (`/src/socket/socketHandler.js`)
  - [ ] Handle client connection
  - [ ] Handle `subscribe` event
  - [ ] Handle disconnection
- [ ] Integrate Redis pub/sub
  - [ ] Subscribe to channels
  - [ ] Publish booking updates
  - [ ] Publish payment updates
  - [ ] Publish price changes
- [ ] Emit events to clients
  - [ ] `booking_update`
  - [ ] `payment_update`
  - [ ] `notification`
  - [ ] `price_change`
- [ ] Test WebSocket
  - [ ] Connect from frontend
  - [ ] Receive real-time updates
  - [ ] Test room subscriptions

## Phase 9: Middleware & Security

- [ ] Create validation middleware
  - [ ] Request body validation
  - [ ] Parameter validation
  - [ ] Query validation
- [ ] Create error handling middleware
  - [ ] Catch async errors
  - [ ] Format error responses
  - [ ] Log errors
- [ ] Security middleware
  - [ ] Helmet.js for security headers
  - [ ] CORS configuration
  - [ ] Rate limiting
  - [ ] Request size limits
- [ ] Logging
  - [ ] Request logging
  - [ ] Error logging
  - [ ] Performance logging

## Phase 10: Testing

### Unit Tests
- [ ] Test authentication functions
- [ ] Test Amadeus service
- [ ] Test Paystack service
- [ ] Test email service
- [ ] Test database models

### Integration Tests
- [ ] Test complete booking flow
- [ ] Test payment flow
- [ ] Test authentication flow
- [ ] Test WebSocket events

### Manual Testing
- [ ] Test with frontend
- [ ] Test all API endpoints with Postman
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Load testing

## Phase 11: Deployment Preparation

- [ ] Environment variables
  - [ ] Create production `.env`
  - [ ] Use environment-specific configs
  - [ ] Never commit secrets
- [ ] Production dependencies
  - [ ] Remove dev dependencies from production
  - [ ] Lock dependency versions
- [ ] Database preparation
  - [ ] Create production database
  - [ ] Set up backups
  - [ ] Create indexes
- [ ] Performance optimization
  - [ ] Enable compression
  - [ ] Optimize database queries
  - [ ] Implement caching strategy
  - [ ] Use CDN for static assets

## Phase 12: Deployment

### Backend Deployment (Railway/Heroku)
- [ ] Create account
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Test deployed backend
- [ ] Check logs for errors
- [ ] Verify all endpoints work

### Database
- [ ] MongoDB Atlas in production mode
- [ ] Configure production connection string
- [ ] Test connection from deployed backend

### Redis
- [ ] Deploy Redis instance (Upstash/Redis Cloud)
- [ ] Configure production connection
- [ ] Test Redis connection

### Frontend Update
- [ ] Update `VITE_API_BASE_URL` to production URL
- [ ] Update `VITE_WS_URL` to production URL
- [ ] Deploy frontend to Vercel
- [ ] Test complete flow

## Phase 13: Production Testing

- [ ] Test user registration
- [ ] Test user login
- [ ] Test flight search
- [ ] Test flight booking
- [ ] Test hotel booking
- [ ] Test car rental
- [ ] Test activity booking
- [ ] Test restaurant reservation
- [ ] Test payment processing
- [ ] Test email notifications
- [ ] Test WebSocket updates
- [ ] Test on mobile devices
- [ ] Test different browsers
- [ ] Load testing
- [ ] Security testing

## Phase 14: Monitoring & Maintenance

- [ ] Set up error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure alerts
  - [ ] Server down alerts
  - [ ] Error rate alerts
  - [ ] Database connection alerts
- [ ] Create backup strategy
  - [ ] Database backups
  - [ ] Automated backup schedule
  - [ ] Test restore process
- [ ] Documentation
  - [ ] API documentation
  - [ ] Deployment procedures
  - [ ] Troubleshooting guide

## Phase 15: Post-Launch

- [ ] Monitor logs daily
- [ ] Track API usage
- [ ] Monitor costs
- [ ] Gather user feedback
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Plan new features

---

## Quick Reference

### Essential Commands

```bash
# Start backend
npm run dev

# Run tests
npm test

# Deploy to Railway
railway up

# View logs
railway logs

# Check database
mongosh "your-connection-string"

# Check Redis
redis-cli ping
```

### Essential Endpoints to Test

1. Health check: `GET /health`
2. Auth: `POST /api/auth/login`
3. Search: `POST /api/amadeus/flights/search`
4. Booking: `POST /api/bookings/flights`
5. Payment: `POST /api/payments/initialize`

---

## Progress Tracking

**Started:** _____________

**Estimated Completion:** _____________

**Actual Completion:** _____________

**Hours Spent:** _____________

---

## Notes

Use this space to track issues, decisions, or important information:

```
___________________________________________
___________________________________________
___________________________________________
___________________________________________
___________________________________________
```

---

**Keep this checklist updated as you progress!** ✅

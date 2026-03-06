# Backend Setup Instructions

Complete guide to set up and run the Corporate Booking Tool backend.

## 📦 What's Included

Your backend implementation includes:

- ✅ **Complete Express Server** (`server.js`)
- ✅ **MongoDB Models** (User, Flight, Hotel, CarRental, Activity, Restaurant, Payment)
- ✅ **Authentication System** (JWT-based)
- ✅ **Amadeus API Integration** (Flights, Hotels, Cars, Activities)
- ✅ **Paystack Payment Integration** (Initialize, Verify, Webhooks)
- ✅ **Email Service** (SMTP with Nodemailer)
- ✅ **WebSocket** (Socket.io for real-time updates)
- ✅ **Redis Caching** (API response caching & pub/sub)
- ✅ **All API Routes** (Auth, Bookings, Payments, Emails, Webhooks)

## 🚀 Quick Start

### Step 1: Create Backend Directory

```bash
# Create backend folder in your project root
mkdir backend
cd backend
```

### Step 2: Copy All Files

Copy all files from `/backend-implementation/` to your `backend/` directory:

```
backend/
├── server.js
├── package.json
├── .env.example
├── models/
│   ├── User.js
│   ├── Flight.js
│   ├── Hotel.js
│   ├── CarRental.js
│   ├── Activity.js
│   ├── Restaurant.js
│   └── Payment.js
├── routes/
│   ├── auth.js
│   ├── amadeus.js
│   ├── bookings.js
│   ├── payments.js
│   ├── emails.js
│   └── webhooks.js
├── services/
│   ├── amadeusService.js
│   ├── paystackService.js
│   └── emailService.js
└── middleware/
    ├── auth.js
    └── validation.js
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- socket.io
- redis & ioredis
- amadeus
- jsonwebtoken
- bcryptjs
- nodemailer
- cors
- helmet
- dotenv
- express-validator
- express-rate-limit
- axios

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/corporate-booking

# JWT
JWT_SECRET=your-very-long-and-secure-secret-key-here
JWT_EXPIRES_IN=7d

# Redis (Upstash or cloud Redis)
REDIS_URL=rediss://default:YOUR_PASSWORD@your-redis.upstash.io:6379

# OR for local Redis, use these instead:
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=

# Amadeus API
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret
AMADEUS_ENV=test

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your-key
PAYSTACK_PUBLIC_KEY=pk_test_your-key
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Step 5: Set Up Services

#### MongoDB

**Option A: Local**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (all IPs)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

#### Redis

**Option A: Local**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis
```

**Option B: Upstash (Recommended)**
1. Go to https://upstash.com/
2. Create free Redis database
3. Get connection details
4. Update `REDIS_URL` in `.env`

#### Amadeus API

1. Go to https://developers.amadeus.com/
2. Register and create application
3. Get **Test** Client ID and Secret
4. Update `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET` in `.env`

#### Paystack

1. Go to https://paystack.com/
2. Create account
3. Go to Settings → API Keys
4. Get **Test** keys
5. Update `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` in `.env`

#### SMTP Email

**Option A: Gmail**
1. Enable 2FA on Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update SMTP settings in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

**Option B: SendGrid**
1. Sign up at https://sendgrid.com/
2. Create API key
3. Update settings:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.your-api-key
   ```

### Step 6: Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Redis connected
✅ SMTP Server ready to send emails
🚀 Server running on port 5000
```

### Step 7: Test the Backend

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "name": "Test User",
    "company": "Test Corp",
    "role": "user"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```

Save the returned `token` for authenticated requests.

**Search Flights (with token):**
```bash
curl -X POST http://localhost:5000/api/amadeus/flights/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "originLocationCode": "JFK",
    "destinationLocationCode": "LHR",
    "departureDate": "2026-05-15",
    "adults": 1
  }'
```

## 📡 Connect Frontend

Update your frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

Then start your frontend:
```bash
cd ..  # Back to root
npm run dev
```

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect`

**Solutions:**
- Check MongoDB is running: `mongosh`
- Verify connection string in `.env`
- For Atlas: Check network access and credentials

### Redis Connection Error

**Error:** `Error: connect ECONNREFUSED`

**Solutions:**
- Check Redis is running: `redis-cli ping`
- Verify Redis host/port in `.env`
- For Upstash: Check credentials

### Amadeus API Error

**Error:** `401 Unauthorized`

**Solutions:**
- Verify Client ID and Secret are correct
- Check you're using test credentials
- Ensure `AMADEUS_ENV=test` in `.env`

### Paystack Error

**Error:** `Invalid key`

**Solutions:**
- Verify secret key starts with `sk_test_`
- Check you copied the full key
- Ensure no extra spaces in `.env`

### Email Not Sending

**Error:** `Invalid login`

**Solutions:**
- For Gmail: Use App Password, not regular password
- Check SMTP host and port are correct
- Verify credentials in `.env`

## 🎯 API Testing with Postman

1. Import collection from `/backend-implementation/postman_collection.json` (if provided)
2. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (get from login response)

### Test Sequence:

1. ✅ Register user
2. ✅ Login (save token)
3. ✅ Search flights
4. ✅ Create flight booking
5. ✅ Initialize payment
6. ✅ Verify payment
7. ✅ Get bookings

## 🔒 Security Checklist

Before deploying:

- [ ] Change JWT_SECRET to long random string
- [ ] Use production Amadeus credentials
- [ ] Use live Paystack keys
- [ ] Enable MongoDB authentication
- [ ] Set Redis password
- [ ] Use environment-specific configs
- [ ] Enable rate limiting
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Add request validation
- [ ] Implement logging
- [ ] Set up error tracking (Sentry)

## 📊 Database Indexes

The models include indexes for performance. Ensure they're created:

```javascript
// In MongoDB shell or Atlas
use corporate-booking

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.flights.createIndex({ userId: 1, status: 1 })
db.hotels.createIndex({ userId: 1, status: 1 })
db.carrentals.createIndex({ userId: 1, status: 1 })
db.activities.createIndex({ userId: 1, status: 1 })
db.restaurants.createIndex({ userId: 1, status: 1 })
db.payments.createIndex({ paystackReference: 1 }, { unique: true })
```

## 🚀 Deployment

See `/DEPLOYMENT.md` for complete deployment guide.

Quick deploy to Railway:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Add environment variables
railway variables set MONGODB_URI=your-atlas-uri
railway variables set JWT_SECRET=your-secret
# ... add all env vars

# Deploy
railway up
```

## 📝 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (if configured)
```

## 🆘 Getting Help

- Check server logs for errors
- Verify all environment variables are set
- Test each service independently
- Review the `/BACKEND_INTEGRATION.md` for detailed explanations
- Check `/API_ENDPOINTS_REFERENCE.md` for API documentation

## ✅ Setup Complete!

Your backend is now ready to:
- ✅ Handle user authentication
- ✅ Search flights, hotels, cars, activities
- ✅ Create and manage bookings
- ✅ Process payments with Paystack
- ✅ Send email notifications
- ✅ Provide real-time updates via WebSocket
- ✅ Cache API responses with Redis

**Next:** Start your frontend and test the complete application!

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd ..
npm run dev
```

Open http://localhost:5173 and enjoy your fully functional Corporate Booking Tool! 🎉
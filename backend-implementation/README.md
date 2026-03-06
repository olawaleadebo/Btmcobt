# Corporate Booking Tool - Backend Implementation

Complete Node.js + Express + MongoDB backend for the COBT application.

## 📦 What's Included

This folder contains **production-ready backend code** including:

### Core Server
- ✅ **Express.js** HTTP server
- ✅ **Socket.io** WebSocket server
- ✅ **MongoDB** database connection
- ✅ **Redis** caching & pub/sub
- ✅ **CORS** & **Helmet** security

### Database Models (Mongoose)
- `User` - Authentication & profiles
- `Flight` - Flight bookings
- `Hotel` - Hotel reservations
- `CarRental` - Car rental bookings
- `Activity` - Activity bookings
- `Restaurant` - Restaurant reservations
- `Payment` - Payment transactions

### API Routes
- `/api/auth` - Authentication endpoints
- `/api/amadeus` - Travel search (Amadeus API)
- `/api/bookings` - Booking management
- `/api/payments` - Payment processing (Paystack)
- `/api/emails` - Email notifications
- `/api/webhooks` - Payment webhooks

### External Integrations
- **Amadeus API** - Flights, hotels, cars, activities
- **Paystack** - Payment processing & verification
- **SMTP** - Email notifications (Nodemailer)
- **Redis** - Caching & real-time pub/sub

## 🚀 Quick Setup

### 1. Copy to Your Project

```bash
# From your project root
cp -r backend-implementation backend
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- MongoDB connection string
- JWT secret key
- Amadeus API credentials
- Paystack API keys
- Redis connection
- SMTP settings

### 4. Start Server

```bash
npm run dev
```

Server starts on `http://localhost:5000`

## 📋 Environment Variables

Required configuration in `.env`:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/corporate-booking

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Amadeus API
AMADEUS_CLIENT_ID=your-client-id
AMADEUS_CLIENT_SECRET=your-client-secret
AMADEUS_ENV=test

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_WEBHOOK_SECRET=xxx

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@domain.com
```

## 🗂️ File Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .env                   # Your config (create this)
│
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Flight.js
│   ├── Hotel.js
│   ├── CarRental.js
│   ├── Activity.js
│   ├── Restaurant.js
│   └── Payment.js
│
├── routes/                # API endpoints
│   ├── auth.js           # /api/auth/*
│   ├── amadeus.js        # /api/amadeus/*
│   ├── bookings.js       # /api/bookings/*
│   ├── payments.js       # /api/payments/*
│   ├── emails.js         # /api/emails/*
│   └── webhooks.js       # /api/webhooks/*
│
├── services/              # External API integrations
│   ├── amadeusService.js # Amadeus SDK wrapper
│   ├── paystackService.js# Paystack integration
│   └── emailService.js   # SMTP email sender
│
├── middleware/            # Express middleware
│   ├── auth.js           # JWT verification
│   └── validation.js     # Request validation
│
└── SETUP_INSTRUCTIONS.md  # Detailed setup guide
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login user
POST   /api/auth/logout         Logout user
GET    /api/auth/me             Get current user
PUT    /api/auth/update         Update profile
PUT    /api/auth/change-password Change password
```

### Amadeus Search
```
POST   /api/amadeus/flights/search    Search flights
POST   /api/amadeus/hotels/search     Search hotels
POST   /api/amadeus/cars/search       Search car rentals
POST   /api/amadeus/activities/search Search activities
```

### Bookings
```
POST   /api/bookings/flights           Create flight booking
GET    /api/bookings/flights           Get user's flights
POST   /api/bookings/hotels            Create hotel booking
GET    /api/bookings/hotels            Get user's hotels
POST   /api/bookings/cars              Create car booking
GET    /api/bookings/cars              Get user's cars
POST   /api/bookings/activities        Create activity booking
GET    /api/bookings/activities        Get user's activities
POST   /api/bookings/restaurants       Create restaurant booking
GET    /api/bookings/restaurants       Get user's restaurants
GET    /api/bookings/all               Get all bookings
PUT    /api/bookings/:type/:id         Update booking
DELETE /api/bookings/:type/:id         Cancel booking
```

### Payments
```
POST   /api/payments/initialize        Initialize Paystack payment
GET    /api/payments/verify/:ref       Verify payment
POST   /api/payments                   Create payment record
GET    /api/payments                   Get payment history
GET    /api/payments/:id               Get payment details
```

### Emails
```
POST   /api/emails/booking-confirmation Send booking email
POST   /api/emails/payment-receipt      Send payment receipt
POST   /api/emails/cancellation         Send cancellation email
```

### Webhooks
```
POST   /api/webhooks/paystack          Paystack webhook handler
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "company": "Test Corp",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Search Flights (with token)
```bash
curl -X POST http://localhost:5000/api/amadeus/flights/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "originLocationCode": "JFK",
    "destinationLocationCode": "LHR",
    "departureDate": "2026-06-15",
    "adults": 1
  }'
```

## 📚 Dependencies

### Production
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **socket.io** - WebSocket server
- **redis** & **ioredis** - Caching & pub/sub
- **amadeus** - Travel API SDK
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **dotenv** - Environment variables
- **express-validator** - Request validation
- **axios** - HTTP client

### Development
- **nodemon** - Auto-restart server

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation & sanitization
- ✅ Protected routes middleware
- ✅ Role-based authorization
- ✅ Webhook signature verification

## 🚀 Deployment

### Railway (Recommended)
```bash
railway login
railway init
railway up
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 📖 Documentation

- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **API_ENDPOINTS_REFERENCE.md** - Complete API docs (in parent folder)
- **BACKEND_INTEGRATION.md** - Integration guide (in parent folder)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- For Atlas: Check network access

### Redis Error
- Start Redis: `redis-server`
- Or use Upstash cloud Redis

### Amadeus API Error
- Verify credentials are correct
- Check you're using test environment
- Ensure API quota not exceeded

### Email Not Sending
- For Gmail: Use App Password
- Check SMTP settings
- Verify credentials

## 📝 Scripts

```bash
npm start       # Start production server
npm run dev     # Start with nodemon (auto-reload)
npm test        # Run tests (if configured)
```

## 🤝 Support

For issues or questions:
1. Check SETUP_INSTRUCTIONS.md
2. Review inline code comments
3. Check parent folder documentation
4. Review error logs

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB connection tested
- [ ] Redis connection tested
- [ ] Amadeus API credentials verified
- [ ] Paystack API keys configured
- [ ] SMTP email working
- [ ] JWT secret is secure and unique
- [ ] All routes tested
- [ ] WebSocket working
- [ ] Webhooks configured

## 🎉 Ready to Go!

Your backend is production-ready with:
- Complete CRUD operations
- External API integrations
- Payment processing
- Email notifications
- Real-time updates
- Caching for performance
- Security best practices

**Connect it to your frontend and start booking! 🚀**

---

**Need help?** Check the parent folder documentation or review the code comments.

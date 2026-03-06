# Corporate Booking Tool - Backend Integration Guide

This frontend application is ready to integrate with your MongoDB/Node.js/Express backend. Follow this guide to connect all the services.

## 🏗️ Backend Architecture

Your backend should implement the following stack:
- **Node.js + Express** - API server
- **MongoDB** - Database for bookings, users, payments
- **Socket.io** - Real-time WebSocket communication
- **Redis** - Caching and pub/sub for real-time updates
- **Amadeus API** - Flight, hotel, car, and activity search
- **Paystack API** - Payment processing
- **Nodemailer** - SMTP email notifications

## 📁 Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis client setup
│   │   ├── amadeus.js           # Amadeus API config
│   │   └── paystack.js          # Paystack config
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Flight.js            # Flight booking schema
│   │   ├── Hotel.js             # Hotel booking schema
│   │   ├── CarRental.js         # Car rental schema
│   │   ├── Activity.js          # Activity schema
│   │   ├── Restaurant.js        # Restaurant schema
│   │   └── Payment.js           # Payment schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── bookings.js          # Booking CRUD routes
│   │   ├── amadeus.js           # Amadeus API proxy routes
│   │   ├── payments.js          # Paystack integration
│   │   └── emails.js            # Email sending routes
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Request validation
│   ├── services/
│   │   ├── amadeusService.js    # Amadeus API calls
│   │   ├── paystackService.js   # Paystack integration
│   │   └── emailService.js      # SMTP email service
│   ├── socket/
│   │   └── socketHandler.js     # WebSocket event handlers
│   └── server.js                # Main server file
├── package.json
└── .env
```

## 🔧 Installation

### 1. Install Backend Dependencies

```bash
npm install express mongoose socket.io redis ioredis
npm install amadeus dotenv jsonwebtoken bcryptjs
npm install nodemailer cors helmet express-rate-limit
npm install axios
```

### 2. Environment Variables

Create a `.env` file in your backend:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/corporate-booking
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corporate-booking

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Amadeus API
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret
AMADEUS_ENV=test  # or 'production'

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

## 🗄️ MongoDB Schemas

### User Schema (models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'manager'], default: 'user' },
  avatar: String,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Flight Schema (models/Flight.js)

```javascript
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingReference: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: Date,
  passengers: { type: Number, required: true },
  class: { type: String, enum: ['economy', 'business', 'first'], required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  amadeusOfferId: String,
  airline: String,
  flightNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);
```

## 🚀 Main Server Setup (server.js)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

// Redis clients
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const redisSub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/amadeus', require('./routes/amadeus'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/emails', require('./routes/emails'));

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe', (userId) => {
    socket.join(\`user:\${userId}\`);
    console.log(\`User \${userId} subscribed\`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Redis pub/sub for real-time updates
redisSub.subscribe('booking_updates', 'payment_updates', 'price_changes');

redisSub.on('message', (channel, message) => {
  const data = JSON.parse(message);

  if (channel === 'booking_updates') {
    io.to(\`user:\${data.userId}\`).emit('booking_update', data);
  }

  if (channel === 'payment_updates') {
    io.to(\`user:\${data.userId}\`).emit('payment_update', data);
  }

  if (channel === 'price_changes') {
    io.emit('price_change', data);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

// Export for WebSocket and Redis use
module.exports = { io, redis };
```

## 🔐 Authentication Routes (routes/auth.js)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, company, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await User.create({ email, password, name, company, role });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## ✈️ Amadeus Integration (services/amadeusService.js)

```javascript
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: process.env.AMADEUS_ENV === 'production' 
    ? 'production' 
    : 'test'
});

// Search flights
exports.searchFlights = async (params) => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults,
      travelClass: params.travelClass,
      max: params.max || 10,
    });

    return response.data;
  } catch (error) {
    throw new Error(\`Amadeus API error: \${error.message}\`);
  }
};

// Search hotels
exports.searchHotels = async (params) => {
  try {
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: params.cityCode,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults,
      radius: params.radius || 20,
      radiusUnit: 'KM',
    });

    return response.data;
  } catch (error) {
    throw new Error(\`Amadeus API error: \${error.message}\`);
  }
};

// Search car rentals
exports.searchCarRentals = async (params) => {
  try {
    const response = await amadeus.shopping.carRentals.get({
      pickUpLocationCode: params.pickupLocationCode,
      pickUpDate: params.pickupDate,
      dropOffDate: params.dropOffDate,
      dropOffLocationCode: params.dropOffLocationCode,
    });

    return response.data;
  } catch (error) {
    throw new Error(\`Amadeus API error: \${error.message}\`);
  }
};
```

## 💳 Paystack Integration (services/paystackService.js)

```javascript
const axios = require('axios');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize payment
exports.initializePayment = async (data) => {
  try {
    const response = await axios.post(
      \`\${PAYSTACK_BASE_URL}/transaction/initialize\`,
      {
        email: data.email,
        amount: data.amount, // in kobo (NGN) or cents
        reference: data.reference,
        currency: data.currency || 'NGN',
        metadata: data.metadata,
      },
      {
        headers: {
          Authorization: \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(\`Paystack error: \${error.response?.data?.message || error.message}\`);
  }
};

// Verify payment
exports.verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      \`\${PAYSTACK_BASE_URL}/transaction/verify/\${reference}\`,
      {
        headers: {
          Authorization: \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(\`Paystack verification error: \${error.response?.data?.message || error.message}\`);
  }
};
```

## 📧 Email Service (services/emailService.js)

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendBookingConfirmation = async (booking, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: \`Booking Confirmation - \${booking.bookingReference}\`,
    html: \`
      <h1>Booking Confirmed</h1>
      <p>Your booking has been confirmed!</p>
      <p><strong>Reference:</strong> \${booking.bookingReference}</p>
      <p><strong>Status:</strong> \${booking.status}</p>
    \`,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendPaymentReceipt = async (payment, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: \`Payment Receipt - \${payment.paystackReference}\`,
    html: \`
      <h1>Payment Received</h1>
      <p>Thank you for your payment!</p>
      <p><strong>Amount:</strong> \${payment.currency} \${payment.amount}</p>
      <p><strong>Reference:</strong> \${payment.paystackReference}</p>
    \`,
  };

  await transporter.sendMail(mailOptions);
};
```

## 🔄 Real-time Updates

Publish events to Redis when data changes:

```javascript
const { redis } = require('../server');

// After creating/updating a booking
redis.publish('booking_updates', JSON.stringify({
  type: 'booking_update',
  userId: booking.userId,
  data: booking,
  timestamp: new Date(),
}));

// After payment verification
redis.publish('payment_updates', JSON.stringify({
  type: 'payment_update',
  userId: payment.userId,
  data: payment,
  timestamp: new Date(),
}));
```

## 🌐 Frontend Configuration

Update your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

## 🚀 Running the Application

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
npm run dev
```

## 📚 API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Flights**: `GET /api/bookings/flights`, `POST /api/bookings/flights`
- **Hotels**: `GET /api/bookings/hotels`, `POST /api/bookings/hotels`
- **Cars**: `GET /api/bookings/cars`, `POST /api/bookings/cars`
- **Activities**: `GET /api/bookings/activities`, `POST /api/bookings/activities`
- **Restaurants**: `GET /api/bookings/restaurants`, `POST /api/bookings/restaurants`
- **Amadeus**: `POST /api/amadeus/flights/search`, `POST /api/amadeus/hotels/search`
- **Payments**: `POST /api/payments/initialize`, `GET /api/payments/verify/:reference`

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize MongoDB queries
- [ ] Use helmet.js for security headers
- [ ] Store secrets in environment variables
- [ ] Implement proper CORS policies
- [ ] Hash passwords with bcrypt
- [ ] Use JWT for authentication
- [ ] Implement refresh tokens
- [ ] Enable MongoDB authentication
- [ ] Secure Redis with password
- [ ] Validate Paystack webhooks with signature

---

Your frontend is now ready to connect to your backend! All API endpoints are stubbed with mock data and ready to be replaced with real backend calls.

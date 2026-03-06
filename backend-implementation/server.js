// Corporate Booking Tool - Backend Server
// Main entry point for the Node.js/Express backend

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

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Redis clients
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

const redisSub = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Redis event handlers
redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/amadeus', require('./routes/amadeus'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/emails', require('./routes/emails'));
app.use('/api/webhooks', require('./routes/webhooks'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redis.status === 'ready' ? 'connected' : 'disconnected',
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Authenticate socket connection
  const token = socket.handshake.auth.token;
  // TODO: Verify JWT token here if needed

  socket.on('subscribe', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`📡 User ${userId} subscribed to updates`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Redis pub/sub for real-time updates
redisSub.subscribe('booking_updates', 'payment_updates', 'price_changes', 'notifications');

redisSub.on('message', (channel, message) => {
  try {
    const data = JSON.parse(message);

    switch (channel) {
      case 'booking_updates':
        io.to(`user:${data.userId}`).emit('booking_update', data);
        console.log(`📨 Sent booking update to user ${data.userId}`);
        break;

      case 'payment_updates':
        io.to(`user:${data.userId}`).emit('payment_update', data);
        console.log(`💳 Sent payment update to user ${data.userId}`);
        break;

      case 'notifications':
        io.to(`user:${data.userId}`).emit('notification', data);
        console.log(`🔔 Sent notification to user ${data.userId}`);
        break;

      case 'price_changes':
        io.emit('price_change', data); // Broadcast to all users
        console.log(`💰 Broadcasted price change`);
        break;
    }
  } catch (error) {
    console.error('Error processing Redis message:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      redis.quit();
      redisSub.quit();
      process.exit(0);
    });
  });
});

// Export for testing and WebSocket/Redis use
module.exports = { app, io, redis };

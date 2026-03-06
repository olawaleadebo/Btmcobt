import { io, Socket } from 'socket.io-client';
import type { WebSocketEvent } from '../types';

// TODO: Replace with your WebSocket server URL
const WS_URL = process.env.VITE_WS_URL || 'http://localhost:5000';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Connect to WebSocket server
   * TODO: Configure your Node.js server with socket.io:
   * 
   * Backend setup example:
   * const io = require('socket.io')(server, {
   *   cors: { origin: '*' }
   * });
   * 
   * io.on('connection', (socket) => {
   *   console.log('Client connected');
   *   
   *   socket.on('subscribe', (userId) => {
   *     socket.join(`user:${userId}`);
   *   });
   * });
   */
  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: {
        token: localStorage.getItem('authToken'),
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      // Subscribe to user-specific events
      this.socket?.emit('subscribe', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Listen for booking updates
    this.socket.on('booking_update', (data: WebSocketEvent) => {
      this.notifyListeners('booking_update', data);
    });

    // Listen for payment updates
    this.socket.on('payment_update', (data: WebSocketEvent) => {
      this.notifyListeners('payment_update', data);
    });

    // Listen for notifications
    this.socket.on('notification', (data: WebSocketEvent) => {
      this.notifyListeners('notification', data);
    });

    // Listen for price changes (powered by Redis cache)
    this.socket.on('price_change', (data: WebSocketEvent) => {
      this.notifyListeners('price_change', data);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Subscribe to specific events
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit events to server
   */
  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  /**
   * Notify all listeners for an event
   */
  private notifyListeners(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => {
      callback(data);
    });
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
const wsService = new WebSocketService();

export default wsService;

/**
 * BACKEND IMPLEMENTATION GUIDE
 * =============================
 * 
 * 1. Install dependencies in your backend:
 *    npm install socket.io redis ioredis
 * 
 * 2. Setup Redis for pub/sub and caching:
 *    const Redis = require('ioredis');
 *    const redis = new Redis();
 *    const redisSub = new Redis();
 * 
 * 3. Integrate with Socket.IO:
 *    const io = require('socket.io')(server);
 *    
 *    // Subscribe to Redis channels
 *    redisSub.subscribe('booking_updates', 'price_changes');
 *    
 *    redisSub.on('message', (channel, message) => {
 *      const data = JSON.parse(message);
 *      
 *      if (channel === 'booking_updates') {
 *        io.to(`user:${data.userId}`).emit('booking_update', data);
 *      }
 *      
 *      if (channel === 'price_changes') {
 *        io.emit('price_change', data);
 *      }
 *    });
 * 
 * 4. Publish events from your MongoDB operations:
 *    // After creating/updating a booking in MongoDB
 *    redis.publish('booking_updates', JSON.stringify({
 *      userId: booking.userId,
 *      type: 'booking_update',
 *      data: booking
 *    }));
 * 
 * 5. Cache Amadeus API responses in Redis:
 *    // Before making Amadeus API call
 *    const cached = await redis.get(`flights:${searchParams}`);
 *    if (cached) return JSON.parse(cached);
 *    
 *    // After getting Amadeus response
 *    await redis.setex(`flights:${searchParams}`, 300, JSON.stringify(results));
 */

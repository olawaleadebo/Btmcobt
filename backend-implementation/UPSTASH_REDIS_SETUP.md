# Upstash Redis Setup Guide

Quick guide to set up free cloud Redis with Upstash for your COBT backend.

## Why Upstash?

- ✅ **Free tier** - Perfect for development and small projects
- ✅ **No credit card required** for free tier
- ✅ **Global edge caching** - Fast from anywhere
- ✅ **TLS/SSL support** - Secure connections
- ✅ **No server management** - Fully managed service
- ✅ **Works instantly** - No installation needed

## 🚀 Setup Steps

### Step 1: Create Upstash Account

1. Go to https://upstash.com/
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub, Google, or Email
4. Verify your email (if using email signup)

### Step 2: Create Redis Database

1. After login, click **"Create Database"**
2. Configure your database:
   - **Name:** `cobt-redis` (or any name)
   - **Type:** Choose **Regional** (faster) or **Global** (multi-region)
   - **Region:** Choose closest to your backend server
   - **TLS:** Keep **enabled** (recommended)
3. Click **"Create"**

### Step 3: Get Connection Details

After creating, you'll see your database dashboard with:

1. **REST API** tab - For HTTP-based access (optional)
2. **Details** tab - This is what you need!

Look for the **"Redis URL"** section. You'll see something like:

```
rediss://default:YOUR_PASSWORD_HERE@region-name-12345.upstash.io:6379
```

### Step 4: Copy to Your .env

Copy the entire Redis URL and add to your backend `.env` file:

```env
# Redis (Upstash)
REDIS_URL=rediss://default:AUrUAAIncDJkOTU1YTU5OTJkNDQ0YzE2YTdjYjlmNmQ2ZWVlMWI1OXAyMTkxNTY@thorough-dove-19156.upstash.io:6379
```

**Important Notes:**
- The URL starts with `rediss://` (note the double 's' for SSL)
- Keep this URL **secret** - it contains your password
- Never commit `.env` to git (it's in `.gitignore`)

### Step 5: Test Connection

Start your backend:

```bash
npm run dev
```

You should see:
```
✅ Redis connected
```

If you see an error, check:
- URL is copied correctly
- No extra spaces in `.env`
- No quotes around the URL

## 🔧 Alternative: Using Individual Credentials

Instead of `REDIS_URL`, you can use separate values:

### In Upstash Dashboard:

Find these values in the **Details** tab:
- **Endpoint:** `thorough-dove-19156.upstash.io`
- **Port:** `6379`
- **Password:** `AUrUAAInc...` (long string)

### In your .env:

```env
# Redis (Upstash) - Individual credentials
REDIS_HOST=thorough-dove-19156.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=AUrUAAIncDJkOTU1YTU5OTJkNDQ0YzE2YTdjYjlmNmQ2ZWVlMWI1OXAyMTkxNTY

# Comment out REDIS_URL if using individual credentials
# REDIS_URL=...
```

The backend will automatically use these if `REDIS_URL` is not set.

## 📊 Free Tier Limits

Upstash free tier includes:
- **10,000 commands/day**
- **256 MB storage**
- **1 database**
- **Unlimited connections**
- **TLS/SSL included**

This is more than enough for development and small production apps!

## 🧪 Testing Redis Connection

### From Backend Code

The server already tests the connection on startup. Check logs:

```bash
npm run dev

# Look for:
✅ Redis connected
```

### Manual Test (Optional)

Install Redis CLI:

```bash
npm install -g redis-cli

# Connect to Upstash
redis-cli -u "rediss://default:YOUR_PASSWORD@your-endpoint.upstash.io:6379"

# Test commands
PING
# Should return: PONG

SET test "Hello from Upstash"
GET test
# Should return: "Hello from Upstash"
```

## 🎯 What Redis Does in COBT

Your backend uses Redis for:

1. **API Response Caching** - Cache Amadeus search results (5 min TTL)
   - Flight searches
   - Hotel searches
   - Car rental searches
   - Activity searches

2. **Pub/Sub Messaging** - Real-time updates via WebSocket
   - Booking updates
   - Payment confirmations
   - Price changes
   - User notifications

## 📈 Monitoring Usage

In Upstash dashboard:
1. Go to your database
2. Check **"Metrics"** tab
3. Monitor:
   - Commands per day
   - Storage usage
   - Connection count

## 🔐 Security Best Practices

✅ **DO:**
- Keep `REDIS_URL` in `.env` only
- Use TLS (rediss://) in production
- Rotate passwords periodically
- Monitor for unusual activity

❌ **DON'T:**
- Commit `.env` to git
- Share Redis URL publicly
- Use same database for dev and production
- Disable TLS/SSL

## 🚀 Production Tips

For production deployment:

1. **Create separate database** for production
2. **Use environment variables** in hosting platform
3. **Enable IP filtering** (if supported by host)
4. **Monitor usage** regularly
5. **Upgrade plan** if you hit limits

## 🐛 Troubleshooting

### Connection Timeout

**Problem:** Can't connect to Upstash

**Solutions:**
- Check internet connection
- Verify URL is correct
- Ensure no firewall blocking port 6379
- Try different region

### Authentication Error

**Problem:** `WRONGPASS` or `NOAUTH` error

**Solutions:**
- Double-check password in URL
- Copy URL again from Upstash dashboard
- Remove any extra characters/spaces

### Commands Limit Reached

**Problem:** `Daily command quota exceeded`

**Solutions:**
- Wait for daily reset (midnight UTC)
- Upgrade to paid plan
- Optimize caching strategy
- Increase TTL values

## 💡 Advanced Features

### REST API (Alternative to Redis protocol)

Upstash also provides REST API for serverless environments:

```javascript
// Alternative: Using REST instead of Redis protocol
const axios = require('axios');

const UPSTASH_URL = 'https://your-endpoint.upstash.io';
const UPSTASH_TOKEN = 'your-token';

// Set value
await axios.post(`${UPSTASH_URL}/set/mykey/myvalue`, {}, {
  headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
});

// Get value
const response = await axios.get(`${UPSTASH_URL}/get/mykey`, {
  headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
});
```

This is useful for:
- Serverless functions
- Edge computing
- Environments without persistent connections

## ✅ Setup Complete!

Your Redis is now:
- ✅ Hosted in the cloud
- ✅ Automatically backed up
- ✅ Secured with TLS
- ✅ Ready for caching
- ✅ Ready for pub/sub

**Start your backend and enjoy instant caching and real-time features!** 🚀

---

**Need help?** Check Upstash documentation: https://docs.upstash.com/redis

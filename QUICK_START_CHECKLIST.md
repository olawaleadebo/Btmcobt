# 🚀 Quick Start Checklist

Your complete Corporate Booking Tool is ready! Follow this checklist to get everything running.

## ✅ Prerequisites

Before starting, sign up for these free services:

- [ ] **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas (Free tier)
- [ ] **Upstash Redis** - https://upstash.com/ (Free tier, no credit card)
- [ ] **Amadeus** - https://developers.amadeus.com/ (Test API, free)
- [ ] **Paystack** - https://paystack.com/ (Test keys, free)
- [ ] **Gmail App Password** - https://myaccount.google.com/apppasswords (Free)

## 📦 Step 1: Copy Backend Files

```bash
# From your project root
cp -r backend-implementation backend
cd backend
```

## 📥 Step 2: Install Backend Dependencies

```bash
npm install
```

Expected output: All packages installed successfully

## 🔧 Step 3: Configure Environment

```bash
cp .env.example .env
```

Now edit `backend/.env` with your credentials:

### MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corporate-booking
```
[Get from Atlas → Connect → Connect your application]

### Redis (Upstash)
```env
REDIS_URL=rediss://default:YOUR_PASSWORD@endpoint.upstash.io:6379
```
[Get from Upstash → Database Details → Redis URL]

### JWT Secret (Generate Random)
```env
JWT_SECRET=your-super-long-random-string-here-make-it-at-least-32-characters
```
[Generate: https://randomkeygen.com/]

### Amadeus API
```env
AMADEUS_CLIENT_ID=your-client-id
AMADEUS_CLIENT_SECRET=your-client-secret
AMADEUS_ENV=test
```
[Get from Amadeus → My Apps → API Key]

### Paystack
```env
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxx
```
[Get from Paystack → Settings → API Keys & Webhooks]

### Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=noreply@yourcompany.com
```
[Get App Password from Google Account → Security → 2-Step Verification → App passwords]

### Other Settings
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
```

## 🧪 Step 4: Test Backend

Start the backend server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Redis connected
✅ SMTP Server ready to send emails
🚀 Server running on port 5000
```

If you see all checkmarks, proceed! If not, check troubleshooting below.

## 🔍 Step 5: Test Health Endpoint

Open new terminal:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "redis": "connected",
  "timestamp": "2026-03-06T..."
}
```

## 👤 Step 6: Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User",
    "company": "Test Company",
    "role": "user"
  }'
```

Expected response:
```json
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save the token for next step!

## ✈️ Step 7: Test Flight Search

```bash
curl -X POST http://localhost:5000/api/amadeus/flights/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_FROM_STEP_6" \
  -d '{
    "originLocationCode": "JFK",
    "destinationLocationCode": "LHR",
    "departureDate": "2026-06-15",
    "adults": 1,
    "travelClass": "economy"
  }'
```

Expected: JSON array of flight offers from Amadeus API

## 🎨 Step 8: Start Frontend

Open new terminal from project root:

```bash
npm run dev
```

Expected:
```
  VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## 🌐 Step 9: Test Complete Flow

1. Open http://localhost:5173 in browser
2. Click **"Get Started"** or **"Sign Up"**
3. Register new account
4. Login with credentials
5. Go to **Flights** tab
6. Search for flights (e.g., JFK → LHR, June 15)
7. See real Amadeus flight results! ✈️

## ✅ Success Criteria

You should now have:

- [x] Backend running on port 5000
- [x] Frontend running on port 5173
- [x] MongoDB connected (Atlas)
- [x] Redis connected (Upstash)
- [x] Amadeus API returning flight data
- [x] User registration working
- [x] User login working
- [x] Flight search showing results

## 🐛 Troubleshooting

### Backend won't start

**MongoDB Error:**
```
❌ MongoDB connection error
```
**Fix:** Check `MONGODB_URI` in `.env` - ensure username, password, and cluster name are correct

**Redis Error:**
```
❌ Redis error
```
**Fix:** Check `REDIS_URL` in `.env` - copy complete URL from Upstash dashboard

**Port in use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix:** Stop other process on port 5000 or change `PORT` in `.env`

### Amadeus API Error

**401 Unauthorized:**
```
Flight search failed: 401
```
**Fix:** 
- Verify `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET`
- Ensure `AMADEUS_ENV=test`
- Check credentials in Amadeus dashboard

**Invalid airport code:**
```
Flight search failed: Invalid location
```
**Fix:** Use valid IATA codes (3 letters): JFK, LAX, LHR, CDG, etc.

### Email not working

**SMTP Error:**
```
❌ SMTP Configuration Error
```
**Fix:**
- For Gmail: Use App Password, not regular password
- Verify `SMTP_USER` and `SMTP_PASS` in `.env`
- Check 2FA is enabled on Google account

### Frontend can't connect to backend

**Network Error in browser:**
```
ERR_CONNECTION_REFUSED
```
**Fix:**
- Ensure backend is running (`npm run dev` in backend folder)
- Check `VITE_API_BASE_URL=http://localhost:5000/api` in frontend `.env`

## 📊 Test Credentials Reference

Use these for testing:

### Test Flight Search:
- **Origin:** JFK (New York)
- **Destination:** LHR (London)
- **Date:** 2026-06-15 (future date)
- **Passengers:** 1
- **Class:** Economy

### Test Hotel Search:
- **City:** LON (London)
- **Check-in:** 2026-06-15
- **Check-out:** 2026-06-18
- **Guests:** 2

### Test Car Rental:
- **Location:** JFK
- **Pickup:** 2026-06-15
- **Dropoff:** 2026-06-18

## 🎯 Next Steps

Once everything works:

1. **Explore all features:**
   - [ ] Book a flight
   - [ ] Search hotels
   - [ ] Search car rentals
   - [ ] Search activities
   - [ ] Make restaurant booking
   - [ ] View booking history
   - [ ] Test payment flow

2. **Customize:**
   - [ ] Update company branding
   - [ ] Add your logo
   - [ ] Change color scheme
   - [ ] Add more features

3. **Deploy:**
   - [ ] Deploy backend (Railway, Render, Heroku)
   - [ ] Deploy frontend (Vercel, Netlify)
   - [ ] Use production API keys
   - [ ] Set up custom domain

## 📚 Documentation

- **Backend Setup:** `/backend-implementation/SETUP_INSTRUCTIONS.md`
- **Upstash Redis:** `/backend-implementation/UPSTASH_REDIS_SETUP.md`
- **API Reference:** `/API_ENDPOINTS_REFERENCE.md`
- **Backend Overview:** `/BACKEND_READY.md`

## 🆘 Still Having Issues?

1. Check server logs in terminal
2. Check browser console for errors
3. Verify all `.env` variables are set
4. Ensure no extra spaces or quotes in `.env`
5. Try restarting both backend and frontend

## 🎉 Congratulations!

Your Corporate Booking Tool is now fully operational with:
- ✅ Complete backend (Node.js + Express + MongoDB)
- ✅ Complete frontend (React + TypeScript)
- ✅ Real travel data (Amadeus API)
- ✅ Payment processing (Paystack)
- ✅ Email notifications (SMTP)
- ✅ Real-time updates (WebSocket + Redis)

**Happy booking! ✈️🏨🚗🎉**

---

**Time to completion:** ~20-30 minutes (if all accounts are ready)

**Terminal windows needed:** 2
- Terminal 1: Backend (`backend/` folder)
- Terminal 2: Frontend (project root)

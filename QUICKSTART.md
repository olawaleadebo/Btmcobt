# Quick Start Guide - Corporate Booking Tool

Get up and running with the Corporate Booking Tool in minutes.

## 🎯 For Frontend Development (Current State)

The application currently runs with **mock data** for frontend development. No backend required!

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Access the Application
Open your browser to: **http://localhost:5173**

### Step 4: Login
Use any email/password to login (mock authentication):
- Email: `demo@company.com`
- Password: `anything`

### Step 5: Explore Features
- ✅ Browse the dashboard
- ✅ Search for flights, hotels, cars
- ✅ Make test bookings (data not persisted)
- ✅ View booking history
- ✅ Test the UI and UX

## 🔌 For Full Stack Development (With Backend)

To enable real bookings, payments, and data persistence, you need to set up the backend.

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)
- Amadeus API credentials
- Paystack account

### Step 1: Set Up Backend

Create a new backend project:

```bash
mkdir backend
cd backend
npm init -y
```

### Step 2: Install Backend Dependencies

```bash
npm install express mongoose socket.io redis ioredis amadeus jsonwebtoken bcryptjs nodemailer cors helmet dotenv
```

### Step 3: Configure Environment

Copy the backend configuration from `BACKEND_INTEGRATION.md` and create `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/corporate-booking
JWT_SECRET=your-secret-key
AMADEUS_CLIENT_ID=your-amadeus-id
AMADEUS_CLIENT_SECRET=your-amadeus-secret
PAYSTACK_SECRET_KEY=sk_test_your-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
SMTP_PASS=your-password
```

### Step 4: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or use your package manager

# Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Step 5: Set Up Redis

**Option A: Local Redis**
```bash
# Install Redis
brew install redis  # macOS

# Start Redis
brew services start redis
```

**Option B: Redis Cloud**
1. Sign up at https://redis.com/try-free/
2. Create database
3. Update REDIS_HOST, REDIS_PORT, REDIS_PASSWORD in .env

### Step 6: Get Amadeus API Credentials

1. Go to https://developers.amadeus.com/
2. Register for a free account
3. Create an application
4. Copy Client ID and Client Secret
5. Update AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in .env

### Step 7: Get Paystack Credentials

1. Go to https://paystack.com/
2. Sign up for an account
3. Go to Settings → API Keys
4. Copy Secret Key and Public Key
5. Update PAYSTACK_SECRET_KEY in backend .env
6. Update PAYSTACK_PUBLIC_KEY in frontend .env (optional)

### Step 8: Configure SMTP for Emails

**Option A: Gmail**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password
3. Update SMTP settings in .env

**Option B: SendGrid/Mailgun**
1. Sign up for a service
2. Get SMTP credentials
3. Update SMTP settings in .env

### Step 9: Create Backend Server

Copy the server implementation from `BACKEND_INTEGRATION.md` to create:
- `server.js`
- `routes/` directory
- `models/` directory
- `services/` directory

### Step 10: Start Backend

```bash
cd backend
npm run dev
```

### Step 11: Configure Frontend

Update frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

### Step 12: Start Frontend

```bash
cd ../  # back to frontend directory
npm run dev
```

### Step 13: Test Everything

1. ✅ Register a new user
2. ✅ Login with credentials
3. ✅ Search for real flights (Amadeus API)
4. ✅ Make a booking (MongoDB)
5. ✅ Process payment (Paystack)
6. ✅ Receive email confirmation (SMTP)
7. ✅ See real-time updates (WebSocket)

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend connection errors
- Check if MongoDB is running: `mongosh`
- Check if Redis is running: `redis-cli ping`
- Verify .env variables are correct
- Check CORS settings allow frontend URL

### Amadeus API errors
- Verify credentials are correct
- Check you're using test environment
- Ensure you have API quota remaining
- Review Amadeus API documentation

### Paystack payment fails
- Verify you're using test keys for development
- Check webhook URL is configured
- Review Paystack dashboard for errors
- Ensure amount is in kobo (NGN) or cents

### Emails not sending
- Verify SMTP credentials
- Check spam folder
- Enable "less secure apps" for Gmail
- Try using App Password instead of regular password

### WebSocket not connecting
- Verify backend Socket.io is running
- Check CORS configuration
- Ensure WS_URL matches backend port
- Check browser console for errors

## 📚 Next Steps

1. **Customize the UI** - Modify components in `src/app/components/`
2. **Add Features** - Extend booking types or add analytics
3. **Integrate APIs** - Connect to your preferred payment gateway
4. **Deploy** - Use Vercel for frontend, Railway/Render for backend
5. **Secure** - Add rate limiting, input validation, HTTPS

## 🎓 Learning Resources

- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Amadeus API**: https://developers.amadeus.com/
- **Paystack Docs**: https://paystack.com/docs/
- **MongoDB**: https://www.mongodb.com/docs/
- **Socket.io**: https://socket.io/docs/

## 💬 Get Help

- Review `BACKEND_INTEGRATION.md` for detailed setup
- Check `README.md` for project overview
- Open an issue for bugs
- Contact your team for support

---

**Happy Coding! 🚀**

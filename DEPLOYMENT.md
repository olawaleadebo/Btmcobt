# Deployment Guide - Corporate Booking Tool

Complete guide for deploying your COBT application to production.

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API    │────▶│    MongoDB      │
│   (Vercel)      │     │   (Railway)      │     │   (Atlas)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ├──────────▶ Redis (Upstash)
                               ├──────────▶ Amadeus API
                               ├──────────▶ Paystack API
                               └──────────▶ SMTP Service
```

## 📦 Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Step 1: Prepare for Deployment

Update `package.json` build script if needed:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: Via GitHub Integration**
1. Push code to GitHub
2. Go to https://vercel.com/
3. Click "Import Project"
4. Select your repository
5. Configure settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   VITE_WS_URL=https://your-backend.railway.app
   ```
7. Click Deploy

### Step 3: Configure Custom Domain (Optional)

1. Go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Vercel Environment Variables
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_WS_URL=wss://your-backend-url.com
```

---

## 🖥️ Backend Deployment (Railway)

### Prerequisites
- GitHub account
- Railway account (free tier available)
- MongoDB Atlas account
- Redis cloud account

### Step 1: Prepare Backend Code

Create `package.json` in backend:
```json
{
  "name": "cobt-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### Step 2: Deploy to Railway

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your backend repository
5. Railway will auto-detect Node.js

### Step 3: Configure Environment Variables

In Railway dashboard, add all environment variables:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corporate-booking

# JWT
JWT_SECRET=your-production-secret-key-very-long-and-secure
JWT_EXPIRES_IN=7d

# Redis (Upstash)
REDIS_HOST=your-redis-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Amadeus API
AMADEUS_CLIENT_ID=your-production-client-id
AMADEUS_CLIENT_SECRET=your-production-client-secret
AMADEUS_ENV=production

# Paystack
PAYSTACK_SECRET_KEY=sk_live_your-live-secret-key
PAYSTACK_PUBLIC_KEY=pk_live_your-live-public-key

# SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### Step 4: Configure Domains

1. Railway provides a default domain
2. Add custom domain in settings
3. Update CORS configuration in backend:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://yourdomain.com'
  ],
  credentials: true
}));
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account (free tier available)
3. Create new cluster
4. Choose region closest to your backend

### Step 2: Configure Database Access

1. Go to "Database Access"
2. Create database user
3. Set username and password
4. Grant read/write access

### Step 3: Configure Network Access

1. Go to "Network Access"
2. Add IP address: `0.0.0.0/0` (allows all IPs)
   - Or whitelist specific Railway IPs
3. Save changes

### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database password
5. Add to Railway environment variables

---

## 🔄 Redis Setup (Upstash)

### Step 1: Create Redis Database

1. Go to https://upstash.com/
2. Create account (free tier available)
3. Create new Redis database
4. Choose region closest to backend

### Step 2: Get Connection Details

1. Copy hostname
2. Copy port
3. Copy password
4. Add to Railway environment variables

### Alternative: Redis Cloud
- https://redis.com/try-free/
- Similar setup process

---

## 📧 Email Service Setup

### Option 1: SendGrid (Recommended)

1. Go to https://sendgrid.com/
2. Create account (free tier: 100 emails/day)
3. Create API key
4. Update environment variables:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-api-key
```

### Option 2: AWS SES

1. Go to AWS SES console
2. Verify sender email
3. Create SMTP credentials
4. Update environment variables

### Option 3: Mailgun

1. Go to https://www.mailgun.com/
2. Create account
3. Get SMTP credentials
4. Update environment variables

---

## 💳 Payment Gateway (Paystack)

### Step 1: Switch to Live Mode

1. Go to https://dashboard.paystack.com/
2. Complete business verification
3. Switch to "Live" mode
4. Get live API keys

### Step 2: Configure Webhooks

1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-backend.railway.app/api/webhooks/paystack`
3. Copy webhook secret
4. Add to environment variables

### Step 3: Test in Production

1. Use live API keys
2. Test with real card (small amount)
3. Verify webhook receives events
4. Check payment record in MongoDB

---

## ✈️ Amadeus API Production

### Step 1: Request Production Access

1. Go to https://developers.amadeus.com/
2. Submit production access request
3. Wait for approval (may take a few days)
4. Get production credentials

### Step 2: Update Environment

```env
AMADEUS_ENV=production
AMADEUS_CLIENT_ID=your-production-id
AMADEUS_CLIENT_SECRET=your-production-secret
```

### Step 3: Test Production API

1. Make test search requests
2. Verify results are live data
3. Monitor API usage in dashboard

---

## 🔒 Security Checklist

### SSL/TLS
- ✅ Enable HTTPS on frontend (Vercel does this automatically)
- ✅ Enable HTTPS on backend (Railway does this automatically)
- ✅ Use `wss://` for WebSocket in production

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different secrets for production
- ✅ Rotate secrets regularly
- ✅ Use strong JWT secret (64+ characters)

### Database Security
- ✅ Use strong database password
- ✅ Enable MongoDB authentication
- ✅ Restrict network access
- ✅ Enable encryption at rest

### API Security
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Sanitize user data
- ✅ Use CORS properly
- ✅ Implement CSRF protection

### Payment Security
- ✅ Never store card details
- ✅ Use Paystack's hosted checkout
- ✅ Verify webhook signatures
- ✅ Log all transactions

---

## 📊 Monitoring & Logging

### Frontend Monitoring (Vercel Analytics)

1. Enable Vercel Analytics in dashboard
2. View real-time traffic
3. Monitor performance metrics

### Backend Monitoring

**Option 1: Railway Logs**
- View logs in Railway dashboard
- Set up log alerts

**Option 2: Sentry**
```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

**Option 3: LogRocket**
- Frontend error tracking
- Session replay
- Performance monitoring

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API keys verified (production)
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Security review completed

### Frontend Deployment
- [ ] Build succeeds locally
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled

### Backend Deployment
- [ ] All dependencies installed
- [ ] Environment variables set in Railway
- [ ] MongoDB Atlas connected
- [ ] Redis connected
- [ ] CORS configured for frontend domain
- [ ] Webhooks configured

### Post-Deployment
- [ ] Frontend loads successfully
- [ ] Backend health check passes
- [ ] WebSocket connection works
- [ ] Database operations work
- [ ] Payments process correctly
- [ ] Emails send successfully
- [ ] Amadeus API returns data
- [ ] Monitor logs for errors

---

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 Performance Optimization

### Frontend
- ✅ Enable Vite production build optimizations
- ✅ Lazy load routes with React.lazy()
- ✅ Optimize images with ImageWithFallback
- ✅ Enable Vercel Edge Network
- ✅ Implement service worker for offline support

### Backend
- ✅ Enable Redis caching for API responses
- ✅ Use database indexes
- ✅ Enable gzip compression
- ✅ Implement API rate limiting
- ✅ Use connection pooling

---

## 🆘 Rollback Plan

### Frontend Rollback (Vercel)
1. Go to Vercel dashboard
2. Navigate to deployments
3. Find previous working deployment
4. Click "Promote to Production"

### Backend Rollback (Railway)
1. Go to Railway dashboard
2. Navigate to deployments
3. Find previous working deployment
4. Click "Redeploy"

### Database Rollback
- Keep regular backups of MongoDB
- Use MongoDB Atlas automatic backups
- Test restore process regularly

---

## 📞 Support Resources

- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/help
- **MongoDB Atlas**: https://www.mongodb.com/support
- **Amadeus**: https://developers.amadeus.com/support
- **Paystack**: https://paystack.com/contact

---

**Your COBT application is now ready for production! 🎉**

# Corporate Booking Tool (COBT)

A comprehensive corporate booking platform for flights, hotels, car rentals, activities, and restaurant reservations. Built with React + TypeScript frontend, designed to integrate with MongoDB, Amadeus API, Paystack, WebSocket, and Redis backend.

![COBT Dashboard](https://images.unsplash.com/photo-1556740738-b6a63e27c4df)

## 🌟 Features

### Booking Services
- ✈️ **Flight Bookings** - Search and book domestic and international flights via Amadeus API
- 🏨 **Hotel Reservations** - Find and reserve hotels worldwide
- 🚗 **Car Rentals** - Rent vehicles for business trips
- 🗺️ **Activities & Tours** - Discover and book local experiences
- 🍽️ **Restaurant Reservations** - Reserve tables at restaurants

### Core Features
- 🔐 **Authentication** - Secure JWT-based login and registration
- 💳 **Payment Processing** - Integrated with Paystack for secure payments
- 📧 **Email Notifications** - SMTP-based booking confirmations and receipts
- 🔄 **Real-time Updates** - WebSocket notifications for booking and payment updates
- 📊 **Booking Management** - Track all bookings in one dashboard
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend (This Repository)
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router 7** - Routing and navigation
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Sonner** - Toast notifications

### Backend (To Be Integrated)
- **Node.js + Express** - API server
- **MongoDB** - Database
- **Socket.io** - WebSocket server
- **Redis** - Caching and pub/sub
- **Amadeus API** - Travel bookings
- **Paystack** - Payment processing
- **Nodemailer** - Email service

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── BookingCard.tsx # Booking service cards
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Flights.tsx     # Flight booking
│   │   ├── Hotels.tsx      # Hotel booking
│   │   ├── Cars.tsx        # Car rental
│   │   ├── Activities.tsx  # Activities booking
│   │   ├── Restaurants.tsx # Restaurant reservations
│   │   ├── Bookings.tsx    # Booking history
│   │   └── Login.tsx       # Authentication
│   ├── layouts/            # Layout components
│   │   └── RootLayout.tsx  # Main layout wrapper
│   ├── routes.ts           # Route configuration
│   └── App.tsx             # Root component
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── services/
│   ├── api.ts              # API service layer
│   └── websocket.ts        # WebSocket service
├── types/
│   └── index.ts            # TypeScript interfaces
└── styles/                 # CSS files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd corporate-booking-tool
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env in the root directory
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser:
```
http://localhost:5173
```

## 🔧 Backend Integration

This frontend is ready to connect to your backend. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for complete setup instructions including:

- MongoDB schemas
- Express API routes
- Amadeus API integration
- Paystack payment setup
- WebSocket configuration
- Redis caching
- SMTP email service

### Quick Backend Setup

1. **MongoDB Connection**: Update `src/services/api.ts` with your API base URL
2. **Amadeus API**: Configure in your backend with client ID and secret
3. **Paystack**: Add your Paystack secret key to backend
4. **WebSocket**: Connect to your Socket.io server
5. **SMTP**: Configure nodemailer with your email credentials

## 📋 API Endpoints

The frontend expects these backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Bookings
- `POST /api/bookings/flights` - Create flight booking
- `GET /api/bookings/flights?userId={id}` - Get user's flights
- `POST /api/bookings/hotels` - Create hotel booking
- `GET /api/bookings/hotels?userId={id}` - Get user's hotels
- `POST /api/bookings/cars` - Create car rental
- `POST /api/bookings/activities` - Create activity booking
- `POST /api/bookings/restaurants` - Create restaurant reservation

### Amadeus Integration
- `POST /api/amadeus/flights/search` - Search flights
- `POST /api/amadeus/hotels/search` - Search hotels
- `POST /api/amadeus/cars/search` - Search car rentals
- `POST /api/amadeus/activities/search` - Search activities

### Payments
- `POST /api/payments/initialize` - Initialize Paystack payment
- `GET /api/payments/verify/:reference` - Verify payment
- `POST /api/payments` - Save payment record to MongoDB

### Emails
- `POST /api/emails/booking-confirmation` - Send booking confirmation
- `POST /api/emails/payment-receipt` - Send payment receipt

## 🔌 WebSocket Events

The application listens for these real-time events:

### Client → Server
- `subscribe` - Subscribe to user-specific events

### Server → Client
- `booking_update` - Booking status changed
- `payment_update` - Payment processed
- `notification` - General notifications
- `price_change` - Price updates from Redis cache

## 💾 Data Models

All TypeScript interfaces are defined in `src/types/index.ts`:

- `User` - User account information
- `Flight` - Flight booking details
- `Hotel` - Hotel reservation details
- `CarRental` - Car rental booking
- `Activity` - Activity booking
- `Restaurant` - Restaurant reservation
- `Payment` - Payment transaction
- `Notification` - User notifications

## 🎨 UI Components

Built with Radix UI for accessibility:
- Button, Input, Label
- Card, Badge, Tabs
- Select, Textarea
- Dialog, Popover
- Toast notifications (Sonner)

## 🔐 Authentication

- JWT-based authentication
- Protected routes
- Automatic token refresh
- Session persistence

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive classes
- Adaptive layouts
- Touch-friendly interfaces

## 🌐 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# WebSocket Configuration
VITE_WS_URL=http://localhost:5000
```

## 🧪 Development

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📦 Key Dependencies

- `react` & `react-dom` - Core React
- `react-router` - Routing
- `axios` - HTTP client
- `socket.io-client` - WebSocket
- `@radix-ui/*` - UI components
- `lucide-react` - Icons
- `sonner` - Notifications
- `tailwindcss` - Styling

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Store sensitive keys in backend only
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Configure proper CORS policies
5. **Input Validation**: Validate all user inputs
6. **XSS Protection**: Sanitize user-generated content
7. **CSRF Protection**: Implement CSRF tokens for state-changing operations

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📄 License

This project is private and proprietary.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact your development team

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Booking analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with more travel APIs
- [ ] AI-powered travel recommendations
- [ ] Team collaboration features
- [ ] Expense reporting integration

## 🙏 Acknowledgments

- **Amadeus for Developers** - Travel API platform
- **Paystack** - Payment infrastructure
- **Radix UI** - Accessible components
- **Tailwind CSS** - Utility-first CSS

---

**Built with ❤️ for corporate travel management**

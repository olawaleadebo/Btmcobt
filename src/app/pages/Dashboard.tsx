import React, { useEffect, useState } from 'react';
import { BookingCard } from '../components/BookingCard';
import { Plane, Hotel, Car, MapPin, UtensilsCrossed, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI } from '../../services/api';
import wsService from '../../services/websocket';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    // Load booking stats
    if (user) {
      loadBookingStats();
    }

    // Listen for real-time updates via WebSocket
    const handleBookingUpdate = (data: any) => {
      toast.success('Booking Updated', {
        description: `Your ${data.type} booking has been ${data.status}`,
      });
      loadBookingStats();
    };

    const handlePaymentUpdate = (data: any) => {
      toast.success('Payment Processed', {
        description: 'Your payment has been confirmed',
      });
    };

    wsService.on('booking_update', handleBookingUpdate);
    wsService.on('payment_update', handlePaymentUpdate);

    return () => {
      wsService.off('booking_update', handleBookingUpdate);
      wsService.off('payment_update', handlePaymentUpdate);
    };
  }, [user]);

  const loadBookingStats = async () => {
    if (!user) return;

    try {
      const allBookings = await bookingAPI.getAllBookings(user._id);
      
      // Calculate stats
      const allItems = [
        ...allBookings.flights,
        ...allBookings.hotels,
        ...allBookings.cars,
        ...allBookings.activities,
        ...allBookings.restaurants,
      ];

      setStats({
        totalBookings: allItems.length,
        pending: allItems.filter((b: any) => b.status === 'pending').length,
        confirmed: allItems.filter((b: any) => b.status === 'confirmed').length,
        totalSpent: allItems.reduce((sum: number, b: any) => sum + (b.price || 0), 0),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const bookingCards = [
    {
      icon: Plane,
      title: 'Flights',
      description: 'Book domestic and international flights',
      path: '/flights',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      icon: Hotel,
      title: 'Hotels',
      description: 'Find and reserve hotel accommodations',
      path: '/hotels',
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      icon: Car,
      title: 'Car Rentals',
      description: 'Rent vehicles for your business trips',
      path: '/cars',
      gradient: 'from-green-500 to-green-700',
    },
    {
      icon: MapPin,
      title: 'Activities',
      description: 'Discover and book local activities',
      path: '/activities',
      gradient: 'from-orange-500 to-orange-700',
    },
    {
      icon: UtensilsCrossed,
      title: 'Restaurants',
      description: 'Make restaurant reservations',
      path: '/restaurants',
      gradient: 'from-red-500 to-red-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-1">Manage your corporate bookings in one place</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Confirmed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900">${stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Cards */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Booking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingCards.map((card) => (
              <BookingCard key={card.path} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Calendar, MapPin, Search, UtensilsCrossed, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { bookingAPI, paystackAPI, emailAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const Restaurants: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    restaurantName: '',
    location: '',
    date: '',
    time: '',
    guests: '2',
    cuisine: '',
    specialRequests: '',
  });

  const handleBookRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const booking = await bookingAPI.createRestaurantBooking({
        userId: user._id,
        restaurantName: formData.restaurantName,
        location: formData.location,
        date: new Date(formData.date),
        time: formData.time,
        guests: parseInt(formData.guests),
        cuisine: formData.cuisine,
        price: 0, // Restaurant bookings may not have upfront payment
        currency: 'USD',
        specialRequests: formData.specialRequests,
      });

      // Send confirmation email
      await emailAPI.sendBookingConfirmation(booking._id, user.email);

      toast.success('Reservation confirmed!', {
        description: `Your table for ${formData.guests} at ${formData.restaurantName} is reserved.`,
      });

      // Reset form
      setFormData({
        restaurantName: '',
        location: '',
        date: '',
        time: '',
        guests: '2',
        cuisine: '',
        specialRequests: '',
      });
    } catch (error) {
      toast.error('Reservation failed', {
        description: 'Unable to process reservation. Please try again.',
      });
    }
  };

  const popularRestaurants = [
    {
      id: 1,
      name: 'The Grand Bistro',
      cuisine: 'French',
      location: 'Downtown',
      rating: 4.8,
      priceRange: '$$$',
    },
    {
      id: 2,
      name: 'Sakura Sushi',
      cuisine: 'Japanese',
      location: 'Midtown',
      rating: 4.9,
      priceRange: '$$$$',
    },
    {
      id: 3,
      name: 'Bella Italia',
      cuisine: 'Italian',
      location: 'West End',
      rating: 4.7,
      priceRange: '$$',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Restaurant Reservations</h1>
          </div>
          <p className="text-red-100 text-lg">Reserve tables at the finest restaurants</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Make a Reservation</h2>
              <form onSubmit={handleBookRestaurant} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="restaurantName" className="mb-2 block">
                      Restaurant Name
                    </Label>
                    <Input
                      id="restaurantName"
                      placeholder="Enter restaurant name"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="City or address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cuisine" className="mb-2 block">
                      Cuisine Type
                    </Label>
                    <Input
                      id="cuisine"
                      placeholder="e.g., Italian, French, Japanese"
                      value={formData.cuisine}
                      onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="mb-2 block">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Dietary restrictions, seating preferences, etc."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Reserve Table
                </Button>
              </form>
            </Card>
          </div>

          {/* Popular Restaurants */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Popular Restaurants</h2>
            <div className="space-y-4">
              {popularRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-32">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1769773297747-bd00e31b33aa"
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{restaurant.name}</h3>
                    <p className="text-sm text-slate-600">{restaurant.cuisine} • {restaurant.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-slate-900">⭐ {restaurant.rating}</span>
                      <span className="text-sm text-slate-600">{restaurant.priceRange}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

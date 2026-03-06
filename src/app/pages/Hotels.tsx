import React, { useState } from 'react';
import { Calendar, MapPin, Users, Search, Hotel as HotelIcon, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { amadeusAPI, bookingAPI, paystackAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const Hotels: React.FC = () => {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    rooms: '1',
  });

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const results = await amadeusAPI.searchHotels({
        cityCode: formData.city,
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        adults: parseInt(formData.guests),
      });

      setSearchResults(results);
      toast.success('Hotels found!', {
        description: `Found ${results.length} available hotels`,
      });
    } catch (error) {
      toast.error('Search failed', {
        description: 'Unable to search hotels. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookHotel = async (hotel: any) => {
    if (!user) return;

    try {
      const booking = await bookingAPI.createHotelBooking({
        userId: user._id,
        hotelName: hotel.name,
        location: formData.city,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        guests: parseInt(formData.guests),
        rooms: parseInt(formData.rooms),
        roomType: 'Standard',
        price: hotel.price,
        currency: hotel.currency,
        amadeusHotelId: hotel.id,
        amenities: hotel.amenities,
      });

      const paymentReference = `hotel-${booking._id}-${Date.now()}`;
      const paymentData = await paystackAPI.initializePayment({
        email: user.email,
        amount: hotel.price * 100,
        reference: paymentReference,
        currency: hotel.currency,
        metadata: {
          bookingId: booking._id,
          bookingType: 'hotel',
          userId: user._id,
        },
      });

      if (paymentData.data.authorization_url) {
        window.location.href = paymentData.data.authorization_url;
      }

      toast.success('Booking initiated!', {
        description: 'Redirecting to payment...',
      });
    } catch (error) {
      toast.error('Booking failed', {
        description: 'Unable to process booking. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-700 text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <HotelIcon className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Hotel Bookings</h1>
          </div>
          <p className="text-purple-100 text-lg">Find and reserve hotels worldwide with Amadeus</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto px-8 -mt-8">
        <Card className="p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                City
              </Label>
              <Input
                id="city"
                placeholder="NYC - New York City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="checkIn" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Check-in
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="checkOut" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Check-out
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="rooms" className="mb-2 block">
                Rooms
              </Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching || !formData.city || !formData.checkIn || !formData.checkOut}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search Hotels'}
          </Button>
        </Card>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={hotel.imageUrl || 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{hotel.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 4).map((amenity: string) => (
                      <span key={amenity} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        ${hotel.price}
                      </p>
                      <p className="text-sm text-slate-600">per night</p>
                    </div>
                    <Button
                      onClick={() => handleBookHotel(hotel)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

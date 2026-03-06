import React, { useState } from 'react';
import { Calendar, MapPin, Search, Car as CarIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { amadeusAPI, bookingAPI, paystackAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const Cars: React.FC = () => {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
  });

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const results = await amadeusAPI.searchCarRentals({
        pickupLocationCode: formData.pickupLocation,
        pickupDate: formData.pickupDate,
        dropOffDate: formData.dropoffDate,
        dropOffLocationCode: formData.dropoffLocation || formData.pickupLocation,
      });

      setSearchResults(results);
      toast.success('Cars found!', {
        description: `Found ${results.length} available vehicles`,
      });
    } catch (error) {
      toast.error('Search failed', {
        description: 'Unable to search cars. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookCar = async (car: any) => {
    if (!user) return;

    try {
      const booking = await bookingAPI.createCarBooking({
        userId: user._id,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation || formData.pickupLocation,
        pickupDate: new Date(formData.pickupDate),
        dropoffDate: new Date(formData.dropoffDate),
        carType: car.type,
        carModel: car.model,
        price: car.price,
        currency: car.currency,
        amadeusOfferId: car.id,
        provider: car.provider,
      });

      const paymentReference = `car-${booking._id}-${Date.now()}`;
      const paymentData = await paystackAPI.initializePayment({
        email: user.email,
        amount: car.price * 100,
        reference: paymentReference,
        currency: car.currency,
        metadata: {
          bookingId: booking._id,
          bookingType: 'car',
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
      <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <CarIcon className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Car Rentals</h1>
          </div>
          <p className="text-green-100 text-lg">Rent vehicles for your business trips with Amadeus</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto px-8 -mt-8">
        <Card className="p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pickupLocation" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Pickup Location
              </Label>
              <Input
                id="pickupLocation"
                placeholder="JFK - New York Airport"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dropoffLocation" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Dropoff Location (Optional)
              </Label>
              <Input
                id="dropoffLocation"
                placeholder="Same as pickup"
                value={formData.dropoffLocation}
                onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="pickupDate" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Pickup Date & Time
              </Label>
              <Input
                id="pickupDate"
                type="datetime-local"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dropoffDate" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Dropoff Date & Time
              </Label>
              <Input
                id="dropoffDate"
                type="datetime-local"
                value={formData.dropoffDate}
                onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching || !formData.pickupLocation || !formData.pickupDate || !formData.dropoffDate}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search Cars'}
          </Button>
        </Card>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1768360612035-8bf84c9fbc0a"
                    alt={car.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <span className="font-semibold text-sm">{car.provider}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{car.model}</h3>
                  <p className="text-sm text-slate-600 mb-4">{car.type}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        ${car.price}
                      </p>
                      <p className="text-sm text-slate-600">{car.perDay ? 'per day' : 'total'}</p>
                    </div>
                    <Button
                      onClick={() => handleBookCar(car)}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
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

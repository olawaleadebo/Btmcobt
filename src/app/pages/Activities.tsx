import React, { useState } from 'react';
import { Calendar, MapPin, Search, MapPinned, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { amadeusAPI, bookingAPI, paystackAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const Activities: React.FC = () => {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    participants: '1',
  });

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const results = await amadeusAPI.searchActivities(
        formData.location,
        formData.date
      );

      setSearchResults(results);
      toast.success('Activities found!', {
        description: `Found ${results.length} available activities`,
      });
    } catch (error) {
      toast.error('Search failed', {
        description: 'Unable to search activities. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookActivity = async (activity: any) => {
    if (!user) return;

    try {
      const booking = await bookingAPI.createActivityBooking({
        userId: user._id,
        activityName: activity.name,
        location: formData.location,
        date: new Date(formData.date),
        duration: activity.duration,
        participants: parseInt(formData.participants),
        price: activity.price,
        currency: activity.currency,
        amadeusActivityId: activity.id,
        description: activity.description,
      });

      const paymentReference = `activity-${booking._id}-${Date.now()}`;
      const paymentData = await paystackAPI.initializePayment({
        email: user.email,
        amount: activity.price * parseInt(formData.participants) * 100,
        reference: paymentReference,
        currency: activity.currency,
        metadata: {
          bookingId: booking._id,
          bookingType: 'activity',
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
      <div className="bg-gradient-to-br from-orange-600 to-amber-700 text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <MapPinned className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Activities & Tours</h1>
          </div>
          <p className="text-orange-100 text-lg">Discover and book amazing experiences</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto px-8 -mt-8">
        <Card className="p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Paris, France"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              />
            </div>

            <div>
              <Label htmlFor="participants" className="mb-2 block">
                Participants
              </Label>
              <Input
                id="participants"
                type="number"
                min="1"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching || !formData.location || !formData.date}
            className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search Activities'}
          </Button>
        </Card>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1763401340723-9d7e5c1eb20e"
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">{activity.duration}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{activity.name}</h3>
                  <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {activity.location}
                  </p>
                  <p className="text-sm text-slate-700 mb-4">{activity.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        ${activity.price}
                      </p>
                      <p className="text-sm text-slate-600">per person</p>
                    </div>
                    <Button
                      onClick={() => handleBookActivity(activity)}
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
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

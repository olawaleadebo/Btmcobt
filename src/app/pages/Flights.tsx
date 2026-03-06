import React, { useState } from 'react';
import { Calendar, MapPin, Users, Search, Plane } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { amadeusAPI, bookingAPI, paystackAPI, emailAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const Flights: React.FC = () => {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    class: 'economy',
  });

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Call Amadeus API through your backend
      const results = await amadeusAPI.searchFlights({
        originLocationCode: formData.origin,
        destinationLocationCode: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        adults: parseInt(formData.passengers),
        travelClass: formData.class,
      });

      setSearchResults(results);
      toast.success('Flights found!', {
        description: `Found ${results.length} available flights`,
      });
    } catch (error) {
      toast.error('Search failed', {
        description: 'Unable to search flights. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookFlight = async (flight: any) => {
    if (!user) return;

    try {
      // Step 1: Create booking in MongoDB
      const booking = await bookingAPI.createFlightBooking({
        userId: user._id,
        origin: formData.origin,
        destination: formData.destination,
        departureDate: new Date(formData.departureDate),
        returnDate: formData.returnDate ? new Date(formData.returnDate) : undefined,
        passengers: parseInt(formData.passengers),
        class: formData.class as any,
        price: flight.price,
        currency: flight.currency,
        amadeusOfferId: flight.id,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
      });

      // Step 2: Initialize Paystack payment
      const paymentReference = `flight-${booking._id}-${Date.now()}`;
      const paymentData = await paystackAPI.initializePayment({
        email: user.email,
        amount: flight.price * 100, // Convert to kobo/cents
        reference: paymentReference,
        currency: flight.currency,
        metadata: {
          bookingId: booking._id,
          bookingType: 'flight',
          userId: user._id,
        },
      });

      // Step 3: Redirect to Paystack checkout
      if (paymentData.data.authorization_url) {
        window.location.href = paymentData.data.authorization_url;
        
        // In production, after payment is verified, send confirmation email
        // This will be handled by your backend webhook from Paystack
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
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Plane className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Flight Bookings</h1>
          </div>
          <p className="text-blue-100 text-lg">Book flights powered by Amadeus API</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto px-8 -mt-8">
        <Card className="p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="origin" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                From
              </Label>
              <Input
                id="origin"
                placeholder="JFK - New York"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="destination" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                To
              </Label>
              <Input
                id="destination"
                placeholder="LHR - London"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="departureDate" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Departure
              </Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="returnDate" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Return (Optional)
              </Label>
              <Input
                id="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="passengers" className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Passengers
              </Label>
              <Select value={formData.passengers} onValueChange={(value) => setFormData({ ...formData, passengers: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class" className="mb-2 block">
                Class
              </Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching || !formData.origin || !formData.destination || !formData.departureDate}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search Flights'}
          </Button>
        </Card>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Flights</h2>
          <div className="space-y-4">
            {searchResults.map((flight) => (
              <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{flight.airline}</p>
                        <p className="text-sm text-slate-600">{flight.flightNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-600 ml-14">
                      <span>{formData.origin}</span>
                      <span>→</span>
                      <span>{formData.destination}</span>
                      <span>•</span>
                      <span>{flight.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{flight.class}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      ${flight.price}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">{flight.currency}</p>
                    <Button
                      onClick={() => handleBookFlight(flight)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

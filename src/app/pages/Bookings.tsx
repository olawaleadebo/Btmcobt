import React, { useEffect, useState } from 'react';
import { Calendar, Plane, Hotel, Car, MapPin, UtensilsCrossed, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Flight, Hotel as HotelType, CarRental, Activity, Restaurant } from '../../types';

export const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [cars, setCars] = useState<CarRental[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      const [flightData, hotelData, carData, activityData, restaurantData] = await Promise.all([
        bookingAPI.getFlightBookings(user._id),
        bookingAPI.getHotelBookings(user._id),
        bookingAPI.getCarBookings(user._id),
        bookingAPI.getActivityBookings(user._id),
        bookingAPI.getRestaurantBookings(user._id),
      ]);

      setFlights(flightData);
      setHotels(hotelData);
      setCars(carData);
      setActivities(activityData);
      setRestaurants(restaurantData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-600 mt-1">View and manage all your reservations</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <p className="text-center text-slate-600 py-12">Loading bookings...</p>
            ) : (
              <>
                {flights.map((flight) => (
                  <Card key={flight._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Plane className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {flight.origin} → {flight.destination}
                            </h3>
                            {getStatusBadge(flight.status)}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {flight.airline} • {flight.flightNumber}
                          </p>
                          <p className="text-sm text-slate-600">
                            {formatDate(flight.departureDate)} • {flight.passengers} passengers
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Booking Ref: {flight.bookingReference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ${flight.price}
                        </p>
                        <p className="text-sm text-slate-600">{flight.currency}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {hotels.map((hotel) => (
                  <Card key={hotel._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Hotel className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{hotel.hotelName}</h3>
                            {getStatusBadge(hotel.status)}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{hotel.location}</p>
                          <p className="text-sm text-slate-600">
                            {formatDate(hotel.checkIn)} - {formatDate(hotel.checkOut)}
                          </p>
                          <p className="text-sm text-slate-600">
                            {hotel.rooms} room(s) • {hotel.guests} guests
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Booking Ref: {hotel.bookingReference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ${hotel.price}
                        </p>
                        <p className="text-sm text-slate-600">{hotel.currency}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {cars.map((car) => (
                  <Card key={car._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Car className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{car.carModel}</h3>
                            {getStatusBadge(car.status)}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {car.carType} • {car.provider}
                          </p>
                          <p className="text-sm text-slate-600">
                            Pickup: {car.pickupLocation} • {formatDate(car.pickupDate)}
                          </p>
                          <p className="text-sm text-slate-600">
                            Dropoff: {car.dropoffLocation} • {formatDate(car.dropoffDate)}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Booking Ref: {car.bookingReference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ${car.price}
                        </p>
                        <p className="text-sm text-slate-600">{car.currency}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {activities.map((activity) => (
                  <Card key={activity._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{activity.activityName}</h3>
                            {getStatusBadge(activity.status)}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{activity.location}</p>
                          <p className="text-sm text-slate-600">
                            {formatDate(activity.date)} • {activity.duration}
                          </p>
                          <p className="text-sm text-slate-600">
                            {activity.participants} participants
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Booking Ref: {activity.bookingReference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ${activity.price}
                        </p>
                        <p className="text-sm text-slate-600">{activity.currency}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {restaurants.map((restaurant) => (
                  <Card key={restaurant._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                          <UtensilsCrossed className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{restaurant.restaurantName}</h3>
                            {getStatusBadge(restaurant.status)}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {restaurant.cuisine} • {restaurant.location}
                          </p>
                          <p className="text-sm text-slate-600">
                            {formatDate(restaurant.date)} at {restaurant.time}
                          </p>
                          <p className="text-sm text-slate-600">
                            {restaurant.guests} guests
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Booking Ref: {restaurant.bookingReference}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {flights.length === 0 && hotels.length === 0 && cars.length === 0 && 
                 activities.length === 0 && restaurants.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No bookings yet</p>
                    <p className="text-sm text-slate-500 mt-1">Start by making your first reservation</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="flights">
            {/* Similar structure for flights only */}
          </TabsContent>

          <TabsContent value="hotels">
            {/* Similar structure for hotels only */}
          </TabsContent>

          <TabsContent value="cars">
            {/* Similar structure for cars only */}
          </TabsContent>

          <TabsContent value="activities">
            {/* Similar structure for activities only */}
          </TabsContent>

          <TabsContent value="restaurants">
            {/* Similar structure for restaurants only */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

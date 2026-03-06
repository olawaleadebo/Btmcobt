import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { Flights } from './pages/Flights';
import { Hotels } from './pages/Hotels';
import { Cars } from './pages/Cars';
import { Activities } from './pages/Activities';
import { Restaurants } from './pages/Restaurants';
import { Bookings } from './pages/Bookings';
import { Login } from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'flights', element: <Flights /> },
      { path: 'hotels', element: <Hotels /> },
      { path: 'cars', element: <Cars /> },
      { path: 'activities', element: <Activities /> },
      { path: 'restaurants', element: <Restaurants /> },
      { path: 'bookings', element: <Bookings /> },
    ],
  },
]);
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
    Component: Login,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'flights', Component: Flights },
      { path: 'hotels', Component: Hotels },
      { path: 'cars', Component: Cars },
      { path: 'activities', Component: Activities },
      { path: 'restaurants', Component: Restaurants },
      { path: 'bookings', Component: Bookings },
    ],
  },
]);

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import ClientHome from './components/ClientHome.jsx';
import UserProvider from './userContext.jsx';
import TourTypes from './components/TourTypes.jsx';
import BookTour from './components/BookTour.jsx';
import WineTypes from './components/WineTypes.jsx';
import OrderWines from './components/OrderWines.jsx';
import Cart from './components/Cart.jsx';
import Pay from './components/pay.jsx';
import { CartProvider } from './components/CartContext.jsx';
import GuideTours from './components/GuideTours.jsx'; 
import GuideHome from './components/GuideHome.jsx';
import AddWine from './components/AddWine.jsx';
import ManagerHome from './components/ManegerHome.jsx';
import ManagerDashboard from './components/ManagerDashboard.jsx';
import SignupManagerOrGuide from './components/SignupManagerOrGuide.jsx';
const router = createBrowserRouter([
  {
      path: '/',
      element: (
        <UserProvider>
          <CartProvider> 
            <App />
          </CartProvider>
        </UserProvider>
      ),
    children: [
      { path: '/', element: <Home /> },
      { path: 'users/signup', element: <Signup /> },
      { path: 'users/login', element: <Login /> },
      { path: 'client-home', element: <ClientHome /> },
      { path: 'tours', element: <TourTypes /> },
      { path: 'book-tour', element: <BookTour /> },
      { path: 'wines', element: <WineTypes /> },
      { path: 'order-wine', element: <OrderWines /> },
      { path: 'cart', element: <Cart /> },
      { path: 'pay', element: <Pay /> },
      { path: 'guide-tours', element: <GuideTours /> },
      { path: 'guides-home', element: <GuideHome />},
      { path: 'add-wine', element: <AddWine />},
      { path: 'managers-home', element: <ManagerHome />},
      { path: 'manager-dashboard/:initialType', element: <ManagerDashboard />},
      { path: 'signup-manager-or-guide', element: <SignupManagerOrGuide />},
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

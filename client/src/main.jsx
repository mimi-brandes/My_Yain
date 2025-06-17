// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import App from './App.jsx';
// import Home from './components/Home.jsx';
// import Signup from './components/Signup.jsx';
// import Login from './components/Login.jsx';
// import ClientHome from './components/ClientHome.jsx';
// import UserProvider from './userContext.jsx';
// import TourTypes from './components/TourTypes.jsx';
// import BookTour from './components/BookTour.jsx';
// import WineTypes from './components/WineTypes.jsx'
// import OrderWines from './components/OrderWines.jsx'
// const router = createBrowserRouter([
 
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       { path:'/', element: <Home /> },
//       { path: 'users/signup', element: <Signup /> },
//       { path: 'users/login', element: <Login /> },
//       { path: 'client-home', element: <ClientHome/> },
//       { path:"/tours", element:<TourTypes />},
//       { path: 'book-tour', element: <BookTour /> },
//       { path:"/wines", element:<WineTypes />},
//       { path:"/order-wine", element:<OrderWines />}
//       // { path: 'managers/home', element: <ManagerHome /> },  // נוסיף קובץ זה
//       // { path: 'guides/home', element: <GuideHome /> }       // ונוסיף גם את זה
//     ]
//   }
// ]);


// createRoot(document.getElementById('root')).render(
//   <UserProvider><RouterProvider router={router} /></UserProvider>
// )

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

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UserProvider>  {/* עוטפים את כל ה-children ב-UserProvider */}
        <App />
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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

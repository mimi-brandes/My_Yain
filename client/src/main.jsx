import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import ClientHome from './components/ClientHome.jsx';
import UserProvider from './userContext.jsx';

const router = createBrowserRouter([
 
  {
    path: '/',
    element: <App />,
    children: [
      { path:'/', element: <Home /> },
      { path: 'users/signup', element: <Signup /> },
      { path: 'users/login', element: <Login /> },
      { path: 'client-home', element: <ClientHome/> }
      // { path: 'managers/home', element: <ManagerHome /> },  // נוסיף קובץ זה
      // { path: 'guides/home', element: <GuideHome /> }       // ונוסיף גם את זה
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <UserProvider><RouterProvider router={router} /></UserProvider>
)
// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <UserProvider>
//       <RouterProvider router={router} />
//     </UserProvider>
//   </React.StrictMode>
// );
 // {
  //   path: '/',
  //   element: <Home />,
  //   children: [
  //     { path: '/', element: <Home /> },
  //     { path: '/signup', element: <Signup /> },
  //     { path: '/login', element: <Login /> }
  //   ]
  // }

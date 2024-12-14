// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

import App from "./App";
import AppLayout from "./layouts/AppLayout";
import LoginLayout from "./layouts/LoginLayout";

import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register"
import Booking from "./pages/Booking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Layout chính có Header, Footer
    children: [
      // { path: "meeting-rooms", element: <MeetingRooms /> },
      { path: "booking", element: <Booking /> },
      // { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/login", 
    element: <LoginLayout />, // 
    children: [
      { path: "", element: <Login /> }, // Trang Login
    ],
  },
  {
    path: "/register", 
    element: <LoginLayout />, // 
    children: [
      { path: "", element: <Register /> }, // Trang Login
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
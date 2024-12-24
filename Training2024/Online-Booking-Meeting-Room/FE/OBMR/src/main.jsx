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
import AdminLayout from "./layouts/AdminLayout";
import RoomController from "./pages/admin/RoomController";
import UserController from "./pages/admin/UserController";
import SendCode from "./pages/Login/SendCode";
import ResetPass from "./pages/Login/ResetPass";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Layout chính có Header, Footer
    children: [
      { path: "booking", element: <Booking /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Layout chính có Header, Footer
    children: [
      // { path: "meeting-rooms", element: <MeetingRooms /> },
      { path: "", element: <RoomController /> },
      { path: "users", element: <UserController /> },
    ],
  },
  {
    path: "/login", 
    element: <Login />, // 
    // children: [
    //   { path: "", element: <Login /> }, // Trang Login
    // ],
  },
  {
    path: "/register", 
    element: <Register />, // 
    // children: [
    //   { path: "", element: <Register /> }, // Trang Login
    // ],
  },
  {
    path: "/sendcode",
    element: <SendCode/>
  },
  {
    path: "/resetpassword",
    element: <ResetPass/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
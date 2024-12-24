import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/Login.css";

const LoginLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LoginLayout;

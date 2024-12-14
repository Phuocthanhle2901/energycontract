import React, { useState } from "react";
import LoginForm from "../../components/Login/LoginForm";


const Login = () => {

  return (
    <div className="bg pt-5">
      <div className="d-flex justify-content-center">
        <LoginForm/>
      </div>
    </div>
  );
};

export default Login;

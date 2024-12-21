import React, { useState } from 'react';
import RightSide from "../../components/Login/rightside"
import axios from 'axios'; import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import '../../styles/style.css'

function SendCode() {
    const navigate = useNavigate();
    return (
        <div className="d-flex custom-vh bg-light">
            {/* Left Side - Login Form */}
            <div className="d-flex flex-column justify-content-center custom-w bg-white px-5 ">
                {/* Nội dung form đăng nhập */}
                <h2 className="text-center mb-4 custom-h2">Forgot Password?</h2>
                <p className="text-muted fw-normal mb-2 custom-p">Don't worry! It occurs. Please enter the email address linked with your account.</p>
                <form className="custom-p" onSubmit={(e) => {
                    e.preventDefault(); // Ngăn chặn hành vi gửi form mặc định
                    navigate("/resetpassword");
                }}>
                    <div className="mb-2 ">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control custom-input"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-custom w-100" > Send code</button>
                </form>
                <div className="mt-3 text-center">

                    <p className="mt-2">
                        Remember an account? <a href="/login" className=" form-label text-decoration-none">Login now</a>
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <RightSide />

        </div>


    );
}

export default SendCode;
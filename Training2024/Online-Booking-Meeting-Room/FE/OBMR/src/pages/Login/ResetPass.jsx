import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import RightSide from "../../components/Login/rightside"
import axios from 'axios';
import '../../styles/style.css'

function ResetPass() {

    const [isTimerActive, setIsTimerActive] = useState(false); // Quản lý trạng thái của bộ đếm
    const [timer, setTimer] = useState(30); // Thời gian đếm ngược
    const [success, setSuccess] = useState(false);
    const handleToggleSuccess = () => {
        setSuccess(!success);
    };
    useEffect(() => {
        let countdown;
        if (isTimerActive && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false); // Dừng đếm ngược khi hết thời gian
            setTimer(30); // Reset thời gian
        }
        return () => clearInterval(countdown); // Xóa bộ đếm khi component unmount
    }, [isTimerActive, timer]);

    const handleSendClick = () => {
        setIsTimerActive(true); // Kích hoạt đếm ngược
    };
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Hàm toggle hiển thị/ẩn mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="d-flex custom-vh bg-light">
            {/* Left Side - Login Form */}
            <div className="d-flex flex-column justify-content-center custom-w bg-white px-5 ">
                {/* Nội dung form đăng nhập */}
                <h2 className="text-center mb-4 custom-h2">Reset Your Password</h2>
                {success ? (
                    <div className="success">
                        <p className="text-muted fw-normal mb-2 text-center">Your password has been reset.</p>
                        <div className="custom-p text-center">
                            <div className="circle-icon">  <i className="fa-solid fa-check"></i></div>

                        </div>

                    </div>
                ) : (
                    <div className="notsuccess">
                        <p className="text-muted fw-normal mb-2 custom-p">Please enter the email verification code to verify your identity.</p>
                        <form className="custom-p" onSubmit={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi gửi form mặc định
                            handleToggleSuccess();
                        }}>
                            <div className="mb-2 ">
                                {/* Nhãn */}
                                <label htmlFor="code" className="form-label">
                                    verification code
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="code"
                                        className="form-control custom-input"
                                        required
                                    />
                                    <span
                                        className={`btn ${isTimerActive ? "btn-secondary" : "btn-custom1"}`}
                                        onClick={!isTimerActive ? handleSendClick : undefined}
                                        disabled={isTimerActive} // Vô hiệu hóa nút khi đang đếm ngược
                                    >
                                        {isTimerActive ? ` ${timer}s` : "Send"}
                                    </span>
                                </div>

                            </div>
                            <div className="mb-2 ">
                                <label htmlFor="password" className="form-label">
                                    Your new password
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="form-control custom-input"
                                        required
                                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}"
                                        title="Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
                                    />
                                    <span

                                        onClick={togglePasswordVisibility}
                                        className="btn btn-custom1"
                                    >
                                        {/* Icon hiển thị hoặc ẩn */}
                                        {showPassword ? (
                                            <i className="fa-solid fa-eye"></i>
                                        ) : (
                                            <i className="fa-solid fa-eye-slash"></i>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-2 ">
                                <label htmlFor="Confpassword" className="form-label">
                                    Confirm your password
                                </label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="Confpassword"
                                        className="form-control custom-input"
                                        required
                                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}"
                                        title="Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."

                                    />

                                </div>
                            </div>
                            <button type="submit" className="btn btn-custom w-100"> Confirm</button>
                        </form>
                    </div>
                )}


                <div className="mt-3 text-center">

                    <p className="mt-2">
                        Have a new password? <a href="/login" className=" form-label text-decoration-none">Login now</a>
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <RightSide />

        </div>


    );
}

export default ResetPass;
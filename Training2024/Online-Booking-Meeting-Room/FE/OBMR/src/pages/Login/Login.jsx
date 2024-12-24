import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import RightSide from "../../components/Login/rightside"
import axios from 'axios';
import '../../styles/style.css'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Hàm toggle hiển thị/ẩn mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra xem tên đăng nhập có chứa khoảng cách hay không
    if (username.includes(' ')) {
      setError('Username must not contain spaces');
      return;
    }
    if (password.includes(' ')) {
      setError('password must not contain spaces');
      return;
    }
    // Kiểm tra các điều kiện khác nếu cần (ví dụ: mật khẩu hợp lệ)
    if (password.length < 8) {
      setError('Password is at least 8 characters long');
      return;
    }


    setError('');

    console.log('Username:', username, 'Password:', password);
  };

  return (
    <div className="d-flex custom-vh bg-light">
      {/* Left Side - Login Form */}
      <div className="d-flex flex-column justify-content-center custom-w bg-white px-5 ">
        {/* Nội dung form đăng nhập */}
        <h2 className="text-center mb-4 custom-h2">Login</h2>
        <form className="custom-p" onSubmit={handleSubmit}>
          <div className="mb-2 ">
            <label htmlFor="email" className="form-label">User name or email address</label>
            <input
              type="text"
              id="email"
              className="form-control custom-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-2 ">
            {/* Nhãn */}
            <label htmlFor="password" className="form-label">
              Your password
            </label>

            {/* Input mật khẩu và nút toggle */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Nút toggle */}
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
          <div className="form-check mb-2 d-flex justify-content-between">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                className="form-check-input"
              />
              <label htmlFor="rememberMe" className="form-label">Remember Me</label>
            </div>
            <a href="/sendcode" className="form-label text-decoration-none ">Forgot password</a>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-custom w-100">Login</button>
        </form>
        <div className="mt-3 text-center">

          <p className="mt-2">
            Don’t have an account? <a href="/register" className=" form-label text-decoration-none">Register now</a>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <RightSide />

    </div>


  );
}

export default Login;
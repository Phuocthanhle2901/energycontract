import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("intern@example.com");
  const [password, setPassword] = useState("password");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="center-page">
      <div className="login-card">
        <h1>Energy Contract Manager</h1>
        <p className="muted">Sign in (mock)</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

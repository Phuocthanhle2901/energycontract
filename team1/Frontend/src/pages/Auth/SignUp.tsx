import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await signUp(email, password, name);
      setUser(response.user);
      setToken(response.token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-page">
      <div className="login-card">
        <h1>⚡ Create Account</h1>
        <p className="muted">Join Energy Contract Manager today</p>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "0.875rem",
              color: "#fca5a5",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/signin"
            style={{
              color: "var(--primary)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

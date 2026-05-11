import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setToken, setUser } from "../utils/storage";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-login">
      <section className="auth-showcase auth-showcase-login" aria-hidden="true">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark" />
          <span>NutriCart</span>
        </Link>

        <div className="auth-showcase-copy">
          <span className="auth-kicker">Welcome back</span>
          <h2>Login</h2>
          <p>For smoother meals, pantry checks, and focused grocery lists.</p>
        </div>
      </section>

      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to continue planning meals smarter.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-success w-100 py-2 rounded-pill" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

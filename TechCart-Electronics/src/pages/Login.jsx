import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserByEmail } from "../api/authApi";
import { setUser } from "../features/auth/authSlice";
import { validateEmail, validatePassword } from "../utils/validators";
import "./AuthPage.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    fetchUserByEmail(form.email)
      .then((res) => {
        const found = res.data[0];
        if (!found) {
          toast.error("No account found with this email");
          return;
        }
        if (found.role === "admin") {
          toast.error("Please use the Admin Login page for admin accounts");
          return;
        }
        if (found.password !== form.password) {
          toast.error("Incorrect password");
          return;
        }
        dispatch(setUser(found));
        toast.success(`Welcome back, ${found.name}!`);
        navigate(redirectTo, { replace: true });
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Login to TechCart</h1>
        <p className="auth-subtitle text-muted">Access your orders, wishlist and cart</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input ${errors.email ? "invalid" : ""}`}
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${errors.password ? "invalid" : ""}`}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New to TechCart? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-switch">
          <Link to="/admin/login">Login as Admin</Link>
        </p>
      </div>
    </div>
  );
}

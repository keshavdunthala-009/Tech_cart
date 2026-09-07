import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserByEmailAndRole } from "../../api/authApi";
import { setUser } from "../../features/auth/authSlice";
import { validateEmail, validatePassword } from "../../utils/validators";
import "../AuthPage.css";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    fetchUserByEmailAndRole(form.email, "admin")
      .then((res) => {
        const found = res.data[0];
        if (!found) {
          toast.error("No admin account found with this email");
          return;
        }
        if (found.password !== form.password) {
          toast.error("Incorrect password");
          return;
        }
        dispatch(setUser(found));
        toast.success(`Welcome back, ${found.name}!`);
        navigate("/admin/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="auth-page admin-auth">
      <div className="auth-card card">
        <span className="auth-badge">Admin Panel</span>
        <h1 className="auth-title">Admin Login</h1>
        <p className="auth-subtitle text-muted">Manage products, orders, users &amp; view analytics</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              className={`form-input ${errors.email ? "invalid" : ""}`}
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@techcart.com"
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
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="auth-switch">
          New admin? <Link to="/admin/register">Create admin account</Link>
        </p>
        <p className="auth-switch">
          <Link to="/login">Back to customer login</Link>
        </p>
      </div>
    </div>
  );
}

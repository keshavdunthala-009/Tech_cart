import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserByEmail, registerUser } from "../../api/authApi";
import { setUser } from "../../features/auth/authSlice";
import { validateName, validateEmail, validatePassword, validatePhone } from "../../utils/validators";
import "../AuthPage.css";

const initialForm = { name: "", email: "", phone: "", password: "", confirmPassword: "", secretCode: "" };

// Simple gate so random customers can't self-register as admin.
const ADMIN_SIGNUP_CODE = "TECHCART-ADMIN";

export default function AdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const nextErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirmPassword: form.confirmPassword !== form.password ? "Passwords do not match" : "",
      secretCode: form.secretCode !== ADMIN_SIGNUP_CODE ? "Invalid admin signup code" : "",
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    fetchUserByEmail(form.email)
      .then((res) => {
        if (res.data.length > 0) {
          toast.error("An account with this email already exists");
          setLoading(false);
          return;
        }
        const newAdmin = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: "admin",
          address: "",
          createdAt: new Date().toISOString(),
        };
        registerUser(newAdmin)
          .then((res2) => {
            dispatch(setUser(res2.data));
            toast.success("Admin account created!");
            navigate("/admin/dashboard", { replace: true });
          })
          .catch(() => {
            toast.error("Could not create account. Please try again.");
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      });
  }

  return (
    <div className="auth-page admin-auth">
      <div className="auth-card card">
        <span className="auth-badge">Admin Panel</span>
        <h1 className="auth-title">Create Admin Account</h1>
        <p className="auth-subtitle text-muted">Requires the admin signup code from your company</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className={`form-input ${errors.name ? "invalid" : ""}`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
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
            <label className="form-label">Phone</label>
            <input
              className={`form-input ${errors.phone ? "invalid" : ""}`}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          <div className="auth-row">
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className={`form-input ${errors.confirmPassword ? "invalid" : ""}`}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Signup Code</label>
            <input
              className={`form-input ${errors.secretCode ? "invalid" : ""}`}
              name="secretCode"
              value={form.secretCode}
              onChange={handleChange}
              placeholder="TECHCART-ADMIN"
            />
            {errors.secretCode && <p className="form-error">{errors.secretCode}</p>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already an admin? <Link to="/admin/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

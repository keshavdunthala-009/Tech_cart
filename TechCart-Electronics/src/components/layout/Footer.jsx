import { Link } from "react-router-dom";
import { CATEGORIES } from "../../constants/categories";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="navbar-logo footer-logo">
            Tech<span>Cart</span>
          </div>
          <p className="text-muted footer-about">
            Your one-stop shop for mobiles, laptops, TVs, ACs, tablets and game consoles —
            genuine products, best prices.
          </p>
        </div>
        <div>
          <h4>Shop by Category</h4>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/products/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/admin/login">Admin Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} TechCart Electronics. All rights reserved.
      </div>
    </footer>
  );
}

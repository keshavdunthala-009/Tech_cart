import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, MapPin, Search, Heart, Menu, LogOut } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { selectCartCount } from "../../features/cart/cartSlice";
import { detectStart, detectSuccess, detectError } from "../../features/location/locationSlice";
import { reverseGeocode } from "../../api/geoApi";
import { CATEGORIES, getCategoryIcon } from "../../constants/categories";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const location = useSelector((state) => state.location);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      dispatch(detectError());
      return;
    }
    dispatch(detectStart());
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude)
          .then((res) => {
            const addr = res.data?.address || {};
            const label =
              addr.suburb || addr.city_district || addr.city || addr.town || addr.village || addr.county || "Your area";
            const pincode = addr.postcode ? `, ${addr.postcode}` : "";
            dispatch(detectSuccess({ label: `${label}${pincode}`, lat: latitude, lon: longitude }));
          })
          .catch(() => {
            dispatch(detectError());
          });
      },
      () => {
        dispatch(detectError());
      }
    );
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-top container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-badge">
            <ShoppingCart size={18} strokeWidth={2.25} />
          </span>
          Tech<span>Cart</span>
        </Link>

        <button
          type="button"
          className="location-pill"
          onClick={handleDetectLocation}
          title="Detect my location"
        >
          <MapPin size={15} className="location-icon" />
          <span className="location-text">
            {location.status === "loading"
              ? "Detecting..."
              : location.address
              ? `Deliver to ${location.address.label}`
              : "Detect location"}
          </span>
        </button>

        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for mobiles, laptops, TVs, ACs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search size={17} />
          </button>
        </form>

        <div className="navbar-actions">
          <Link to="/wishlist" className="navbar-icon-link">
            <Heart size={20} strokeWidth={1.75} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            <small>Wishlist</small>
          </Link>
          <Link to="/cart" className="navbar-icon-link">
            <ShoppingCart size={20} strokeWidth={1.75} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
            <small>Cart</small>
          </Link>

          {user ? (
            <div className="navbar-user">
              <span className="navbar-username">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-accent">
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="navbar-hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>

      <nav className={`navbar-categories ${menuOpen ? "open" : ""}`}>
        <div className="container navbar-categories-inner">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link key={cat.slug} to={`/products/${cat.slug}`} onClick={() => setMenuOpen(false)}>
                <Icon size={15} strokeWidth={1.75} /> {cat.name}
              </Link>
            );
          })}
          {/* Wishlist/Cart/Login/Register already show in the top row on
              desktop — this group only matters inside the mobile dropdown. */}
          <div className="navbar-categories-mobile-only">
            {user ? (
              <>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                  <Heart size={15} strokeWidth={1.75} /> Wishlist ({wishlistCount})
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)}>
                  <ShoppingCart size={15} strokeWidth={1.75} /> Cart ({cartCount})
                </Link>
                <button className="navbar-mobile-logout" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

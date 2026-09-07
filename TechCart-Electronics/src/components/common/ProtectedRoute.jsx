import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// Guards customer-only pages: cart, checkout, wishlist, profile, order-success.
export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

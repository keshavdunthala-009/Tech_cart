import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Guards /admin/* pages. Requires a logged-in user with role "admin".
export default function AdminProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

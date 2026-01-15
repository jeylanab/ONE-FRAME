import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // optional loading

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />; // redirect non-admins
  }

  return children ? children : <Outlet />;
}

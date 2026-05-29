import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "./LoadingSkeleton";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSkeleton variant="auth" />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

export default GuestRoute;

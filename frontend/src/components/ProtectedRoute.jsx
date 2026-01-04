import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { user, authChecked, loading } = useAuthStore();

  if (!authChecked || loading) {
    return <Loader text="Checking authentication..." />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

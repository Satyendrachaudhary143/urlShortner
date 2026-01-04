import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "./Loader";

const ProtectLoginReg = ({ children }) => {
  const { user, authChecked, loading } = useAuthStore();

  if (!authChecked || loading) {
    return <Loader text="Please wait..." />;
  }

  return user ? <Navigate to="/shorten" replace /> : children;
};

export default ProtectLoginReg;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectLoginReg = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/shorten" replace />;
  }

  return children;
};

export default ProtectLoginReg; 
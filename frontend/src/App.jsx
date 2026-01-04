import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Shortener from "./components/Shortener";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectLoginReg from "./components/ProtectLoginReg";
import ForgotePass from "./components/ForgotePass";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

function App() {
  const { checkAuth, authChecked, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔥 App-level loader
  if (!authChecked || loading) {
    return <Loader text="Loging..." />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#fff",
              color: "#333",
            },
          }}
        />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <ProtectLoginReg>
                <Login />
              </ProtectLoginReg>
            }
          />

          <Route
            path="/signup"
            element={
              <ProtectLoginReg>
                <Signup />
              </ProtectLoginReg>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ProtectLoginReg>
                <ForgotePass />
              </ProtectLoginReg>
            }
          />

          <Route
            path="/shorten"
            element={
              <ProtectedRoute>
                <Shortener />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

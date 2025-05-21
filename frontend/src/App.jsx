import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Shortener from './components/Shortener';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectLoginReg from './components/ProtectLoginReg';
import ForgotePass from './components/ForgotePass';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <ProtectLoginReg>

                <Login />
              </ProtectLoginReg>
            } />
            <Route path="/signup" element={
              <ProtectLoginReg>
                <Signup />
              </ProtectLoginReg>
            } />
            <Route
              path="/shorten"
              element={
                <ProtectedRoute>
                  <Shortener />
                </ProtectedRoute>
              }
            />
            <Route
              path="forgot-password"
              element={
              <ProtectLoginReg>
                <ForgotePass />
              </ProtectLoginReg>

              }
            />
         
            
            
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

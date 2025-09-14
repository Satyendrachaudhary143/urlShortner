import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const hideAuthButtons = location.pathname === '/login' || location.pathname === '/signup';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
            URL Shortener
          </Link>
          <div className="flex items-center">
            {user ? (
              <>
                
                <button
                  onClick={logout}
                  className="text-white hover:text-blue-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Hamburger for small screens */}
                {!hideAuthButtons && (
                  <>
                    <button
                      className="sm:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-blue-600 hover:border-blue-600 focus:outline-none"
                      onClick={() => setMenuOpen(!menuOpen)}
                      aria-label="Toggle menu"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    {/* Menu for small screens */}
                    {menuOpen && (
                      <div className="absolute right-2 top-16 bg-white shadow-lg rounded-md py-2 px-4 flex flex-col space-y-2 sm:hidden">
                        <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" onClick={() => setMenuOpen(false)}>
                          Login
                        </Link>
                        <Link to="/signup" className="btn-primary text-white" onClick={() => setMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </div>
                    )}
                    {/* Buttons for larger screens */}
                    <div className="hidden sm:flex items-center space-x-6">
                      <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                        Login
                      </Link>
                      <Link to="/signup" className="btn-primary text-white">
                        Sign Up
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  Loader2,
} from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useUrlStore } from "../store/urlStore";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout, loading } = useAuthStore();
  const { clearLatest, latestShortUrl } = useUrlStore();



  const hideAuthButtons =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-extrabold text-blue-600">
            URL Shortener
          </Link>

          {/* DESKTOP */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => {
                  clearLatest();

                  logout();
                }}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:text-red-500 hover:border-red-400 transition bg-white disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                Logout
              </button>
            ) : (
                !hideAuthButtons && (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition bg-white"
                    >
                      <LogIn size={18} />
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <UserPlus size={18} />
                      Sign Up
                    </Link>
                </>
              )
            )}
          </div>

          {/* MOBILE MENU ICON (ALWAYS VISIBLE) */}
          {!hideAuthButtons && (
            <button
              onClick={() => setMenuOpen(true)}
              className="sm:hidden p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 transition"
            >
              <Menu size={26} />
            </button>
          )}
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* RIGHT SIDEBAR */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* CLOSE */}
          <button
            onClick={() => setMenuOpen(false)}
            className="self-end p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 transition"
          >
            <X size={24} />
          </button>

          {/* MOBILE MENU CONTENT */}
          <div className="mt-10 flex flex-col gap-4">
            {user ? (
              <button
                onClick={() => {
                  clearLatest();
                  logout();

                  setMenuOpen(false);
                }}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut size={20} />
                )}
                Logout
              </button>
            ) : (
              !hideAuthButtons && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:border-blue-500 hover:text-blue-600 transition bg-white"
                  >
                    <LogIn size={20} />
                    Login
                  </Link>

                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-3 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      <UserPlus size={20} />
                      Sign Up
                    </Link>
                  </>
                )
            )}
          </div>

          <div className="flex-grow" />
        </div>
      </div>
    </>
  );
};

export default Navbar;

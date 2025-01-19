import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "../hooks/auth";
import { useAuth } from "../contexts/AuthContext";

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    const user = localStorage.getItem("wallet_currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wallet_currentUser");
    setCurrentUser(null);
    navigate("/login", { replace: true });
    window.history.pushState(null, '', '/login'); // Clear browser history state
  };

  const navItems: NavItem[] = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/accounts", label: "Accounts", icon: "wallet" },
    { path: "/transactions", label: "Transactions", icon: "exchange" },
    { path: "/categories", label: "Categories", icon: "category" },
    { path: "/budgets", label: "Budgets", icon: "chart-pie" },
    { path: "/reports", label: "Reports", icon: "document" },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="main-container flex justify-between items-center">
        {/* Logo and Menu Toggle Section */}
        <div className="flex items-center gap-4">
          <button
            className="text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
          <Link
            to="/"
            className="text-white font-medium text-xl flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6c0-1.1.9-2 2-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm3 0h14v2H6V6zm0 4h14m-14 4h14m-14 4h14"
              />
            </svg>
            Wallet
          </Link>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-gray-800 md:static md:flex md:w-auto md:space-x-4 md:block`}
        >
          {currentUser &&
            navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-white hover:text-gray-300 px-4 py-2 md:inline-block text-sm ${
                  location.pathname === item.path ? "bg-gray-700 rounded" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
        </div>

        {/* Profile/Logout Section */}
        <div className="flex items-center gap-x-4">
          {currentUser ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-white">
                  {currentUser.name}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {currentUser.email}
                  </div>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ${
                  location.pathname === "/login" ? "bg-blue-700" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ${
                  location.pathname === "/signup" ? "bg-blue-700" : ""
                }`}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
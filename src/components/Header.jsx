import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header({ onSearch }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!(token && userId));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/home");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <header className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png" // Replace with the actual path to your logo image
          alt="Toko Ilham Logo"
          className="h-10 w-10 mr-2"
        />
        <Link to="/home" className="hover:text-gray-200">
          <h1 className="text-2xl font-bold">TOKO ILHAM</h1>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari di Toko Ilham"
          className="px-4 py-2 rounded bg-white text-black"
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Cari
        </button>
      </form>

      {/* Icons Section */}
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="hover:text-gray-200 relative">
              <FaHeart className="text-2xl" />
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="hover:text-gray-200 relative">
              <FaShoppingCart className="text-2xl" />
            </Link>

            {/* User Icon with Dropdown */}
            <div className="relative user-menu">
              <button
                onClick={toggleDropdown}
                className="hover:text-gray-200 flex items-center"
              >
                <FaUser className="text-2xl" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-200">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

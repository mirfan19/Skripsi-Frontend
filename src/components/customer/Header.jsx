import { useState, useEffect } from "react";
import { FaUser, FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export default function Header({ onSearch }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 py-2">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img src="/Toko Ilham.jpg" alt="Toko Ilham" className="h-8 md:h-10 w-auto rounded" />
            <Link to="/home" className="ml-2 hover:text-gray-200">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">TOKO ILHAM</h1>
            </Link>
          </div>

          {/* Search Bar - Hidden on Mobile, shown in mobile menu or as separate block */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari di Toko Ilham"
                className="w-full px-4 py-2 rounded-l-md bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-900 transition flex items-center"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link to="/wishlist" className="hover:text-gray-200 transition-colors">
                  <FaHeart className="text-xl" />
                </Link>
                <Link to="/cart" className="hover:text-gray-200 transition-colors">
                  <FaShoppingCart className="text-xl" />
                </Link>
                <div className="relative user-menu">
                  <button
                    onClick={toggleDropdown}
                    className="hover:text-gray-200 flex items-center transition-colors px-1"
                  >
                    <FaUser className="text-xl" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
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
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4 items-center">
                <Link to="/login" className="hover:text-gray-200 text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-1.5 rounded-md hover:bg-gray-100 text-sm font-bold transition">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && (
              <Link to="/cart" className="hover:text-gray-200 relative">
                <FaShoppingCart className="text-xl" />
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar/Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-blue-500 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex px-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari di Toko Ilham"
                  className="flex-1 px-4 py-2 rounded-l-md bg-white text-black text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-800 text-white px-4 py-2 rounded-r-md"
                >
                  Cari
                </button>
              </form>
            </div>
            <div className="space-y-2 px-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/home"
                    className="block px-3 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Beranda
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-700 text-red-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

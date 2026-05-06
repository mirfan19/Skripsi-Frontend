import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaShoppingCart, FaBars, FaTimes, FaBell, FaCircle } from "react-icons/fa";
import api from "../../api/axios";

export default function Header({ onSearch }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!(token && userId));

    if (token && userId) {
      fetchNotifications(userId);
    }
  }, []);

  const fetchNotifications = async (userId) => {
    try {
      const response = await api.get(`/notifications/${userId}`);
      if (response.data && response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id, productId) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.NotificationID === id ? { ...n, IsRead: true } : n));
      setIsNotificationOpen(false);
      if (productId) {
        navigate(`/products/${productId}`);
      } else {
        navigate("/wishlist");
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.IsRead).length;

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
    setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
      if (!e.target.closest(".notification-menu")) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="w-full px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 md:h-20 py-2">
          {/* Left: Logo */}
          <div className="flex justify-start items-center">
            <div className="flex items-center shrink-0">
              <img src="/Toko Ilham.jpg" alt="Toko Ilham" className="h-8 md:h-10 w-auto rounded" />
              <Link to="/home" className="ml-2 hover:text-gray-200">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap">TOKO ILHAM</h1>
              </Link>
            </div>
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className="hidden md:flex justify-center items-center w-full">
            <div className="w-full max-w-lg">
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
                  className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-900 transition flex items-center whitespace-nowrap"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>

          {/* Right: Icons & Mobile Button */}
          <div className="flex justify-end items-center space-x-4 md:space-x-6">
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
                  
                  {/* Notification Dropdown */}
                  <div className="relative notification-menu">
                    <button
                      onClick={toggleNotification}
                      className="hover:text-gray-200 flex items-center transition-colors px-1 relative"
                    >
                      <FaBell className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-bold text-gray-800">Notifications</h3>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="px-4 py-4 text-sm text-gray-500 text-center">No notifications</div>
                        ) : (
                          notifications.map((notif) => (
                            <button
                              key={notif.NotificationID}
                              onClick={() => markAsRead(notif.NotificationID, notif.ProductID)}
                              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 flex items-start space-x-3 transition-colors ${!notif.IsRead ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="flex-shrink-0 mt-1">
                                {notif.Type === 'price_drop' && <span className="text-green-500 text-lg">💰</span>}
                                {notif.Type === 'promo' && <span className="text-red-500 text-lg">🔥</span>}
                                {notif.Type === 'low_stock' && <span className="text-orange-500 text-lg">⚠️</span>}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${!notif.IsRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                  {notif.Message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {!notif.IsRead && (
                                <FaCircle className="text-blue-500 text-[8px] mt-2 flex-shrink-0" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Menu Dropdown */}
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

            {/* Mobile Menu Buttons */}
            <div className="md:hidden flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  <div className="relative notification-menu">
                    <button onClick={toggleNotification} className="hover:text-gray-200 relative">
                      <FaBell className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="font-bold text-gray-800">Notifications</h3>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="px-4 py-4 text-sm text-gray-500 text-center">No notifications</div>
                        ) : (
                          notifications.map((notif) => (
                            <button
                              key={notif.NotificationID}
                              onClick={() => markAsRead(notif.NotificationID, notif.ProductID)}
                              className={`w-full text-left px-4 py-3 border-b border-gray-50 flex items-start space-x-3 ${!notif.IsRead ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="flex-1">
                                <p className={`text-sm ${!notif.IsRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                  {notif.Message}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Link to="/cart" className="hover:text-gray-200 relative">
                    <FaShoppingCart className="text-xl" />
                  </Link>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
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

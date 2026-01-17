import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Header from "./Header";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const showNotif = (message, type = "success") => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif({ show: false, message: "", type }), 2000);
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await api.get(`/wishlists/user/${userId}`);

      if (response.data.success) {
        setWishlist(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }
      const response = await api.delete(
        `/wishlists/user/${userId}/product/${productId}`
      );
      if (response.data.success) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.Product.ProductID !== productId)
        );
        showNotif("Item removed from wishlist!", "success");
      } else {
        showNotif(
          response.data.message || "Failed to remove item from wishlist",
          "error"
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showNotif(
        error.response?.data?.message || "Failed to remove item from wishlist",
        "error"
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login", {
        state: { from: "/wishlist" },
      });
      return;
    }

    fetchWishlist();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Animasi pop up notifikasi */}
      <AnimatePresence>
        {notif.show && (
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-semibold ${
              notif.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notif.message}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No items in wishlist
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
          {wishlist.map((item) => (
            <div
              key={item.Product.ProductID}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow relative"
            >
              {/* Delete button */}
              <button
                onClick={() => removeFromWishlist(item.Product.ProductID)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2"
                title="Remove from wishlist"
              >
                <FaTrash size={16} />
              </button>

              <img
                src={
                  item.Product.ImageURL
                    ? item.Product.ImageURL.startsWith("http")
                      ? item.Product.ImageURL
                      : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${item.Product.ImageURL}`
                    : "/product-placeholder.png"
                }
                alt={item.Product.ProductName}
                className="w-full h-40 md:h-56 lg:h-64 max-h-64 object-cover object-center mb-2 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/product-placeholder.png";
                }}
              />
              <h3 className="font-semibold text-lg">
                {item.Product.ProductName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.Product.Description}
              </p>
              <p className="text-lg font-bold text-blue-600">
                Rp {item.Product.Price.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

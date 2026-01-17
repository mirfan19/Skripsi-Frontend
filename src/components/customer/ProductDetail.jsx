import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaMinus, FaPlus } from "react-icons/fa";
import api from "../../api/axios";
import Header from "./Header";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      setError("Failed to load product details");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.StockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const addToWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }
      const response = await api.post("/wishlists/add", {
        UserID: userId,
        ProductID: product.ProductID,
      });
      if (response.data.success) {
        alert("Product added to wishlist!");
      } else {
        alert(response.data.message || "Failed to add product to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to add product to wishlist."
      );
    }
  };

  const addToCart = async (e, productId) => {
    e.stopPropagation(); // Prevent navigation when clicking the cart button
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      await api.post("/cart/add", {
        UserID: userId,
        ProductID: productId,
        Quantity: quantity, // Use the selected quantity
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="text-center py-8 text-red-600">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left - Image */}
            <div className="md:w-1/2 p-8">
              <img
                src={
                  product.ImageURL
                    ? product.ImageURL.startsWith("http")
                      ? product.ImageURL
                      : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${product.ImageURL}`
                    : "/product-placeholder.png"
                }
                alt={product.ProductName}
                className="w-full h-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/product-placeholder.png";
                }}
              />
            </div>

            {/* Right - Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.ProductName}
                </h1>
                <button
                  onClick={addToWishlist}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaHeart size={24} />
                </button>
              </div>

              <p className="text-2xl font-bold text-blue-600 mt-4">
                Rp {product.Price ? product.Price.toLocaleString("id-ID") : '0'}
              </p>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="mt-2 text-gray-600">{product.Description}</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-4 text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {product.StockQuantity > 0 && (
                <button
                  className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={(e) => addToCart(e, product.ProductID)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

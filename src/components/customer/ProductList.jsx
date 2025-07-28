import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import api from "../../api/axios";
import Header from "./Header";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate]);

  const fetchProducts = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/products", {
        params: { search: query },
      });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId"); // Assume user ID is stored in localStorage
      const response = await api.post("/api/wishlists/add", {
        UserID: userId,
        ProductID: productId,
      });
      alert("Product added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add product to wishlist.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    fetchProducts(query);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={handleSearch} />
      <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No products found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
          {products.map((product) => (
            <div
              key={product.ProductID}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow relative cursor-pointer"
              onClick={() => navigate(`/products/${product.ProductID}`)}
            >
              <img
                src={
                  product.ImageURL
                    ? product.ImageURL.startsWith("http")
                      ? product.ImageURL
                      : `http://localhost:3000${product.ImageURL}`
                    : "/product-placeholder.png"
                }
                alt={product.ProductName}
                className="w-full h-32 object-cover mb-2 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/product-placeholder.png";
                }}
              />
              <h3 className="font-semibold text-lg">{product.ProductName}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.Description}
              </p>
              <p className="text-lg font-bold text-blue-600">
                Rp {product.Price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-500">
                Stock: {product.StockQuantity}
              </p>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => addToWishlist(product.ProductID)}
              >
                <FaHeart size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

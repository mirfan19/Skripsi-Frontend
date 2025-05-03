import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/products", {
        // Update endpoint to match backend
        params: { search: query },
      });
      console.log("Products response:", response.data);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  const handleLogout = () => {
    // Clear the token and update login state
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home"); // Redirect to home page - CORRECTED ROUTE
  };

  const handleLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png" // Replace with the actual path to your logo image
            alt="Toko Ilham Logo"
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-2xl font-bold">TOKO ILHAM</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full px-4 py-2 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="space-x-4 flex items-center">
          <Link to="/products" className="hover:underline">
            Produk
          </Link>
          <Link to="/services" className="hover:underline">
            Pelayanan
          </Link>
          <Link to="/about" className="hover:underline">
            Tentang Kami
          </Link>
        </nav>

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="hover:text-gray-200 relative">
            <FaHeart className="text-2xl" />
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="hover:text-gray-200 relative">
            <FaShoppingCart className="text-2xl" />
          </Link>

          {/* User Icon with Login/Logout */}
          <div className="relative group">
            <button className="hover:text-gray-200 flex items-center">
              <FaUser className="text-2xl" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12 px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Semua Kebutuhan Kantor Ada Disini
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Kami menyediakan berbagai macam alat tulis kantor, fotocopy, dan
          kebutuhan lainnya.
        </p>
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Lihat Produk
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-8">
        <h2 className="text-2xl font-bold mb-6">Produk</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.ProductID}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    product.ImageURL
                      ? `http://localhost:3000${product.ImageURL}`
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
                {product.StockQuantity > 0 && (
                  <button
                    className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => {
                      /* Add to cart functionality */
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-white py-12 px-8">
        <h2 className="text-2xl font-bold mb-6">Tentang Kami</h2>
        <p className="text-gray-600">
          Toko Ilham adalah toko serba ada yang menyediakan berbagai kebutuhan
          alat tulis kantor, fotocopy, dan lainnya. Kami berkomitmen untuk
          memberikan pelayanan terbaik kepada pelanggan kami.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-12 px-8">
        <h2 className="text-2xl font-bold mb-6">Pelayanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Fotocopy</h3>
            <p className="text-sm text-gray-600">
              Layanan fotocopy cepat dan berkualitas.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Cetak Dokumen</h3>
            <p className="text-sm text-gray-600">
              Cetak dokumen dengan berbagai ukuran dan format.
            </p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-white py-12 px-8">
        <h2 className="text-2xl font-bold mb-6">Lokasi</h2>
        <p className="text-gray-600 mb-4">
          Kunjungi toko kami di alamat berikut:
        </p>
        <div className="w-full h-64 bg-gray-200 rounded">
          {/* Replace with an actual map or embed */}
          <p className="text-center text-gray-600 pt-24">Map Placeholder</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 px-8 text-center">
        <p>&copy; 2025 TOKO ILHAM. All rights reserved.</p>
      </footer>
    </div>
  );
}

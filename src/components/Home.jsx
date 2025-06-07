import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa"; // Import wishlist icon
import api from "../api/axios";
import Header from "./Header";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userId");

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
      const response = await api.post("/wishlists/add", {
        UserID: userId,
        ProductID: productId,
      });
      alert("Product added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add product to wishlist.");
    }
  };

  const addToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      await api.post("/cart/add", {
        UserID: userId,
        ProductID: productId,
        Quantity: 1,
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
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
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
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
                className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow relative"
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

                {isLoggedIn ? (
                  <>
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => addToWishlist(product.ProductID)}
                    >
                      <FaHeart size={20} />
                    </button>
                    {product.StockQuantity > 0 && (
                      <button
                        className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={(e) => addToCart(e, product.ProductID)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="mt-2 block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Login to Purchase
                  </Link>
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
      </section>{" "}
      {/* Location Section */}
      <section className="bg-white py-12 px-8">
        <h2 className="text-2xl font-bold mb-6">Lokasi</h2>
        <p className="text-gray-600 mb-4">
          Kunjungi toko kami di alamat berikut:
        </p>
        <div className="mb-4">
          <p className="text-gray-700">
            Jl. Pahlawan No.25 A, Empang, Kota Bogor Selatan, Kota Bogor, Jawa
            Barat 16132
          </p>
        </div>
        <div className="w-full h-96 rounded overflow-hidden shadow-lg">
          {" "}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.0997074520583!2d119.93090117450498!3d-3.999920944612649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d95c4fa1e23e255%3A0x3815a58d9dabe896!2sToko%20ILHAM!5e0!3m2!1sid!2sid!4v1749280552961!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Toko Ilham Location"
            className="rounded"
          ></iframe>
        </div>
        <div className="mt-4 flex justify-center">
          <a
            href="https://maps.app.goo.gl/u1H2cHAgWtyPizjGA"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition inline-flex items-center"
          >
            Buka di Google Maps
          </a>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 px-8 text-center">
        <p>&copy; 2025 TOKO ILHAM. All rights reserved.</p>
      </footer>
    </div>
  );
}

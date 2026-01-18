import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // Tambahkan ini
import api, { STATIC_BASE_URL } from "../../api/axios";
import Header from "./Header";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userId");

  const fetchProducts = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/products", {
        params: { search: query },
      });
      setProducts((response.data.data || []).slice(0, 4));
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan notifikasi
  const showNotif = (message, type = "success") => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif({ show: false, message: "", type }), 2000);
  };

  const addToWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      await api.post("/wishlists/add", {
        UserID: userId,
        ProductID: productId,
      });
      showNotif("Product added to wishlist!", "success");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showNotif("Failed to add product to wishlist.", "error");
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
      showNotif("Product added to cart!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotif("Failed to add product to cart", "error");
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
      <Header />

      {/* Notifikasi animasi */}
      <AnimatePresence>
        {notif.show && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-semibold ${
              notif.type === "success"
                ? "bg-blue-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notif.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div
        className="w-full rounded-xl overflow-hidden mb-6 relative px-4"
        style={{ marginTop: 20 }}
      >
        <div className="relative h-48 md:h-80 w-full rounded-xl overflow-hidden shadow-lg">
          <img
            src={"/assets/lasse-jensen-84mFDd6bZG4-unsplash.jpg"}
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
            <span className="bg-cyan-600 bg-opacity-90 text-white text-lg md:text-3xl font-bold px-4 md:px-8 py-2 md:py-4 rounded shadow-lg text-center leading-tight">
              SEMUA KEBUTUHAN KANTOR ADA DISINI
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-0">
        {/* Products Section */}
        <section className="py-12 px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Produk</h2>
            <a
              href="/products"
              className="text-white bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-1 rounded transition-colors duration-150"
              style={{ textDecoration: "none" }}
            >
              See more
            </a>
          </div>
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
                  className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow relative cursor-pointer"
                  onClick={() => navigate(`/products/${product.ProductID}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      navigate(`/products/${product.ProductID}`);
                  }}
                >
                  <img
                    src={
                      product.ImageURL
                        ? product.ImageURL.startsWith("http")
                          ? product.ImageURL
                          : `${STATIC_BASE_URL}${product.ImageURL}`
                        : "/product-placeholder.png"
                    }
                    alt={product.ProductName}
                    className="w-full h-40 md:h-56 lg:h-64 max-h-64 object-cover object-center mb-2 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/product-placeholder.png";
                    }}
                  />
                  <h3 className="font-semibold text-lg">
                    {product.ProductName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.Description}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    Rp {product.Price ? Number(product.Price).toLocaleString("id-ID") : "0"}
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

        {/* Section 1: TOKO ILHAM */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 px-8">
          <div className="md:w-1/2 order-2 md:order-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">TOKO ILHAM</h1>
            <p className="text-base text-gray-700 leading-relaxed text-justify">
              Toko Ilham merupakan sebuah toko alat tulis dan kantor (ATK) yang
              menyediakan berbagai kebutuhan perlengkapan kerja, baik untuk
              individu maupun perusahaan. Toko ini menjual beragam produk
              seperti alat tulis, kertas, map, tinta printer, perlengkapan
              arsip, hingga peralatan kantor seperti stapler, mesin penghancur
              kertas, dan perlengkapan presentasi. Dengan koleksi barang yang
              lengkap, Toko Ilham berkomitmen untuk menjadi solusi satu tempat
              bagi pelanggan yang membutuhkan perlengkapan kantor berkualitas.
              Selain itu, pelayanan yang ramah dan ketersediaan stok yang
              terjaga menjadikan Toko Ilham sebagai pilihan utama bagi
              masyarakat dalam memenuhi kebutuhan administrasi dan operasional
              kantor.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
              alt="Toko Ilham"
              className="rounded-lg object-cover w-full max-w-sm md:max-w-md h-64 shadow-xl"
            />
          </div>
        </div>

        {/* Section 2: Pelayan */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-8">
          <div className="md:w-1/2 flex justify-center order-1">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80"
              alt="Pelayanan"
              className="rounded-lg object-cover w-full max-w-sm md:max-w-md h-64 shadow-xl"
            />
          </div>
          <div className="md:w-1/2 order-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 md:text-right">PELAYANAN</h2>
            <p className="text-base text-gray-700 leading-relaxed md:text-right text-justify">
              Pelayanan di Toko Ilham berfokus pada kepuasan pelanggan dengan
              mengutamakan kecepatan, ketepatan, dan keramahan dalam setiap
              transaksi. Staf toko siap membantu pelanggan dalam memilih produk
              yang sesuai dengan kebutuhan, memberikan informasi terkait
              spesifikasi barang, serta memastikan proses pembelian berlangsung
              mudah dan nyaman. Selain melayani pembelian langsung di toko, Toko
              Ilham juga menyediakan layanan pemesanan dan konsultasi produk
              untuk pelanggan yang memerlukan jumlah besar atau barang khusus.
              Dengan pelayanan yang responsif dan profesional, Toko Ilham
              berkomitmen untuk memberikan pengalaman berbelanja yang efisien
              dan memuaskan bagi seluruh pelanggan.
            </p>
          </div>
        </div>

        {/* Location Section */}
        <section className="bg-white py-12 px-8">
          <h2 className="text-2xl font-bold mb-6">Lokasi</h2>
          <p className="text-gray-600 mb-4">
            Kunjungi toko kami di alamat berikut:
          </p>
          <div className="mb-4">
            <p className="text-gray-700">
              Jl. H. Datu Sulolipu, Belawa, Kec. Belawa, Kabupaten Wajo,
              Sulawesi Selatan 90953
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
      </div>
      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 px-8 text-center">
        <p>&copy; 2025 TOKO ILHAM. All rights reserved.</p>
      </footer>
    </div>
  );
}

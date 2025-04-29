import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TOKO ILHAM</h1>
        <nav className="space-x-4">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <img
                src="/product-placeholder.png" // Replace with actual product image URL if available
                alt={product.ProductName}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="font-semibold">{product.ProductName}</h3>
              <p className="text-sm text-gray-600">Rp {product.Price}</p>
            </div>
          ))}
        </div>
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

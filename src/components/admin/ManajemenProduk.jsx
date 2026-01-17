import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function ManajemenProduk() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await api.get("/admin/products");
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load products");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete handlers
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/admin/products/${productToDelete}`);
      setShowConfirmDelete(false);
      setProductToDelete(null);
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      setError(
        "Failed to delete product. " +
          (error.response?.data?.message || "Please try again.")
      );
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setProductToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Produk
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-4">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gambar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.ProductID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.ProductID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.ProductName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.ImageURL ? (
                        <img
                          src={
                            product.ImageURL.startsWith("http")
                              ? product.ImageURL
                              : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${
                                  product.ImageURL
                                }`
                          }
                          alt={product.ProductName}
                          className="h-16 w-16 object-cover rounded shadow"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rp {product.Price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.StockQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.ProductID}`)
                        }
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.ProductID)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
              <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus produk ini?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

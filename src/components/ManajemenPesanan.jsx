import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function ManajemenPesanan() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders", {
        params: {
          search: searchQuery,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleDetail = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders(); // Refresh orders after status update
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 min-h-screen flex flex-col relative">
        <div className="p-4 flex-1">
          <h1 className="text-white text-2xl font-bold mb-8">TOKO ILHAM</h1>
          <nav className="space-y-2">
            <Link
              to="/admin"
              className="block py-2.5 px-4 rounded text-white hover:bg-blue-700"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="block py-2.5 px-4 rounded text-white hover:bg-blue-700"
            >
              Manajemen Produk
            </Link>
            <Link
              to="/admin/orders"
              className="block py-2.5 px-4 rounded bg-blue-700 text-white"
            >
              Manajemen Pesanan
            </Link>
            <Link
              to="/admin/reports"
              className="block py-2.5 px-4 rounded text-white hover:bg-blue-700"
            >
              Laporan Keuangan
            </Link>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login/admin");
          }}
          className="w-[90%] mb-4 mx-auto block py-3 bg-red-500 text-white font-bold rounded-xl shadow transition-all duration-200 hover:bg-red-600 focus:outline-none text-lg"
        >
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pesanan..."
                className="px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cari
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    #Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.OrderID} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{order.OrderID}</td>
                    <td className="px-6 py-4">{order.User?.Username}</td>
                    <td className="px-6 py-4 text-right">
                      Rp. {order.TotalAmount?.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.Status === "Menunggu"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.Status === "Selesai"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDetail(order.OrderID)}
                        className="text-blue-600 hover:text-blue-800 mx-2"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

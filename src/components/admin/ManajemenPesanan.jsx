import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";
import { FaSearch, FaEye } from "react-icons/fa";

export default function ManajemenPesanan() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("orders", {
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
      await api.put(`orders/${orderId}`, { status: newStatus });
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
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 md:ml-64 mt-16 md:mt-0">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
            <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pesanan..."
                className="flex-1 md:w-64 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center shadow-md active:scale-95"
                title="Cari"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto -mx-6 md:mx-0">
            <table className="min-w-[600px] md:min-w-full">
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors inline-flex items-center"
                          title="Detail Pesanan"
                        >
                          <FaEye size={18} />
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

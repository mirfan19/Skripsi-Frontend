import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";
import { 
  FaBox, FaShoppingCart, FaUserTie, FaPlus, FaClock, 
  FaExclamationTriangle, FaCheckCircle, FaSpinner, 
  FaArrowRight, FaUsers, FaChartLine 
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Unified Dashboard State
  const [dashboardData, setDashboardData] = useState({
    recentActivities: [],
    recentOrders: [],
    statusCounts: [],
    lowStockProducts: [],
    topSelling: [],
    stats: {
      totalSales: 0,
      newOrdersCount: 0,
      lowStockCount: 0
    },
    insights: {
      newCustomersCount: 0
    }
  });

  const [loading, setLoading] = useState(true);

  // Fetch Consolidated Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
          navigate("/login/admin");
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Single call to the consolidated endpoint
        const response = await api.get("admin/dashboard/stats");
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Handle auth error
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login/admin");
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInMin = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMin < 1) return "Baru saja";
    if (diffInMin < 60) return `${diffInMin} menit lalu`;
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    return `${diffInDays} hari lalu`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'selesai':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'diproses':
        return 'bg-blue-100 text-blue-800';
      case 'dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Operational Dashboard</h2>
            <p className="text-gray-600 mt-1">Real-time monitoring and database insights</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center">
              <FaClock className="mr-2" /> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </button>
          </div>
        </div>

        {/* Shortcut / Quick Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/admin/products" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center group">
            <div className="bg-blue-50 p-3 rounded-lg mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FaPlus />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Tambah Produk</p>
              <p className="text-xs text-gray-500">Input stok baru</p>
            </div>
          </Link>
          <Link to="/admin/orders" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center group">
            <div className="bg-orange-50 p-3 rounded-lg mr-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <FaShoppingCart />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Kelola Pesanan</p>
              <p className="text-xs text-gray-500">Cek status pengiriman</p>
            </div>
          </Link>
          <Link to="/admin/suppliers" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center group">
            <div className="bg-purple-50 p-3 rounded-lg mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FaUserTie />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Manajemen Supplier</p>
              <p className="text-xs text-gray-500">Kontak pemasok</p>
            </div>
          </Link>
        </div>

        {/* Top Cards Section - Now Using Consolidated Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Penjualan</p>
              <h3 className="text-2xl font-bold mt-1">Rp {Number(dashboardData.stats.totalSales).toLocaleString("id-ID")}</h3>
            </div>
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <FaChartLine size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Pesanan Baru</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardData.stats.newOrdersCount}</h3>
            </div>
            <div className="bg-orange-100 p-4 rounded-full text-orange-600">
              <FaShoppingCart size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Stok Kritis</p>
              <h3 className="text-2xl font-bold mt-1 text-red-600">{dashboardData.stats.lowStockCount} <span className="text-sm font-normal text-gray-400 font-medium">Produk</span></h3>
            </div>
            <div className="bg-red-100 p-4 rounded-full text-red-600">
              <FaBox size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Aktivitas Terakhir</h3>
              <FaClock className="text-gray-400" />
            </div>
            <div className="p-5 space-y-6">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm ${
                        activity.Action === 'CREATE_ORDER' ? 'bg-green-100 text-green-600' :
                        activity.Action.includes('PRODUCT') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.Action === 'CREATE_ORDER' ? '🧾' : activity.Action.includes('ADD') ? '➕' : '📦'}
                      </div>
                      {idx !== dashboardData.recentActivities.length - 1 && (
                        <div className="absolute top-8 left-4 w-px h-full bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-tight">{activity.Description}</p>
                      <p className="text-xs text-gray-400 mt-1">{getRelativeTime(activity.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-10">Belum ada aktivitas.</p>
              )}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="font-bold text-gray-800">Pesanan Terbaru</h3>
              <Link to="/admin/orders" className="text-blue-600 text-xs font-semibold hover:underline flex items-center">
                Lihat Semua <FaArrowRight className="ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto -mx-5 md:mx-0">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">ID Pesanan</th>
                    <th className="px-6 py-4">Nama Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData.recentOrders.length > 0 ? (
                    dashboardData.recentOrders.map((order) => (
                      <tr key={order.OrderID} className="hover:bg-gray-50 transition-colors transition-all duration-200">
                        <td className="px-6 py-4 font-medium text-gray-900 font-mono text-sm leading-6">#INV-{order.OrderID}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium leading-6">{order.User?.Username || 'Walk-in'}</td>
                        <td className="px-6 py-4 font-bold text-gray-900 leading-6">Rp {Number(order.TotalAmount).toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4 leading-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.Status)}`}>
                            {order.Status}
                          </span>
                        </td>
                        <td className="px-6 py-4 leading-6">
                          <Link to={`/admin/orders/${order.OrderID}`} className="text-blue-600 hover:text-blue-800 font-bold transition-transform active:scale-95 inline-block">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-400">Tidak ada pesanan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Critical Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-red-50/30">
              <h3 className="font-bold text-gray-800 flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" /> Detail Stok Kritis
              </h3>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">Penting</span>
            </div>
            <div className="p-5">
              {dashboardData.lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.lowStockProducts.map((product) => (
                    <div key={product.ProductID} className="flex justify-between items-center p-3 rounded-xl border border-dashed border-gray-200 hover:border-red-300 hover:bg-red-50/20 transition-all">
                      <div>
                        <p className="font-bold text-gray-800">{product.ProductName}</p>
                        <p className="text-xs text-gray-500 font-medium">Sisa Stok: <span className="text-red-600 font-bold">{product.StockQuantity}</span></p>
                      </div>
                      <Link to={`/admin/products`} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm">
                        Restock
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🎉
                  </div>
                  <p className="text-green-600 font-bold">Stok Aman!</p>
                  <p className="text-gray-400 text-sm">Tidak ada produk dengan stok kritis.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-50">
              <h3 className="font-bold text-gray-800">Distribusi Status Pesanan</h3>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                {['Pending', 'Diproses', 'Selesai'].map((status) => {
                  const count = dashboardData.statusCounts.find(s => s.Status?.toLowerCase() === status.toLowerCase())?.count || 0;
                  const total = dashboardData.statusCounts.reduce((acc, curr) => acc + parseInt(curr.count), 0) || 1;
                  const percentage = Math.round((count / total) * 100);
                  
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">{status}</span>
                        <span className="text-sm font-extrabold text-blue-600">{count} Pesanan</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            status === 'Pending' ? 'bg-yellow-400' : 
                            status === 'Diproses' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Operational Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg border border-blue-500/50 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-blue-100 font-medium">Produk Terlaris</p>
              <div className="mt-4 space-y-3">
                {dashboardData.topSelling.length > 0 ? (
                  dashboardData.topSelling.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-blue-500/30 pb-2 last:border-0 hover:bg-white/10 p-1 rounded transition-colors group">
                      <span className="truncate mr-2 font-medium opacity-90">{item.Product?.ProductName}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter group-hover:scale-110 transition-transform">{item.totalQty} sold</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-blue-200 opacity-60">Data belum tersedia.</p>
                )}
              </div>
            </div>
            <FaChartLine className="absolute -bottom-4 -right-4 text-blue-500/10 text-8xl transform group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <FaUsers className="text-blue-500 mr-2" /> Pertumbuhan User
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-gray-900 mb-2">{dashboardData.insights.newCustomersCount}</div>
              <p className="text-sm text-gray-500 font-medium">Customer baru hari ini</p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < dashboardData.insights.newCustomersCount ? 'bg-blue-600 animate-pulse' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

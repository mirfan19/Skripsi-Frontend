import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import MonthlyIncomeChart from "./MonthlyIncomeChart";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State Management
  const [stats, setStats] = useState({
    totalPenjualan: 0,
    pesananBaru: 0,
    stokMenipis: 0,
  });

  const [transaction, setTransaction] = useState({
    selectedProduct: "",
    quantity: 1,
    cart: [],
    totalBelanja: 0,
    pembayaran: 0,
    kembalian: 0,
    transactionId: "",
  });

  // Admin Authentication Check
  useEffect(() => {
    const checkAdminAndFetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
          // Redirect to admin login
          navigate("/login/admin");
          return;
        }

        // Add token to request headers
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Check admin role
        const response = await api.get("/auth/check-role");
        if (response.data.data.role !== "admin") {
          navigate("/login/admin");
          return;
        }

        // Fetch admin dashboard stats
        const [salesRes, ordersRes, productsRes] = await Promise.all([
          api.get("/admin/stats/total-sales"),
          api.get("/admin/stats/new-orders"),
          api.get("/admin/stats/low-stock"),
        ]);

        setStats({
          totalPenjualan: salesRes.data.total || 0,
          pesananBaru: ordersRes.data.count || 0,
          stokMenipis: productsRes.data.count || 0,
        });
      } catch (error) {
        console.error("Error:", error);
        // Clear auth data on error
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login/admin");
      }
    };

    checkAdminAndFetchStats();
  }, [navigate]);

  // Transaction Handlers
  const handleScanProduct = async (barcode) => {
    try {
      const response = await api.get(`/api/v1/products/barcode/${barcode}`);
      const product = response.data;
      const updatedCart = [
        ...transaction.cart,
        {
          ...product,
          quantity: parseInt(transaction.quantity),
        },
      ];

      const total = updatedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setTransaction((prev) => ({
        ...prev,
        cart: updatedCart,
        totalBelanja: total,
      }));
    } catch (error) {
      console.error("Error scanning product:", error);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedCart = transaction.cart.filter((_, i) => i !== index);
    const total = updatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTransaction((prev) => ({
      ...prev,
      cart: updatedCart,
      totalBelanja: total,
    }));
  };

  const handlePembayaranChange = (value) => {
    setTransaction((prev) => ({
      ...prev,
      pembayaran: value,
      kembalian: value - prev.totalBelanja,
    }));
  };

  const handleSimpanTransaksi = async () => {
    try {
      const response = await api.post("/api/v1/transactions", {
        items: transaction.cart,
        total: transaction.totalBelanja,
        payment: transaction.pembayaran,
        change: transaction.kembalian,
      });

      setTransaction({
        selectedProduct: "",
        quantity: 1,
        cart: [],
        totalBelanja: 0,
        pembayaran: 0,
        kembalian: 0,
        transactionId: response.data.transactionId,
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    // Remove auth header
    delete api.defaults.headers.common["Authorization"];
    navigate("/login/admin");
  };

  // Render UI Components
  const renderSidebar = () => (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold mb-8">TOKO ILHAM</h1>
      <nav className="space-y-2">
        <Link to="/admin" className="block py-2.5 px-4 rounded bg-blue-700">
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="block py-2.5 px-4 rounded hover:bg-blue-500"
        >
          Manajemen Produk
        </Link>
        <Link
          to="/admin/orders"
          className="block py-2.5 px-4 rounded hover:bg-blue-500"
        >
          Manajemen Pesanan
        </Link>
        <Link
          to="/admin/reports"
          className="block py-2.5 px-4 rounded hover:bg-blue-500"
        >
          Laporan Keuangan
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="absolute bottom-4 left-4 right-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log out
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {renderSidebar()}

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Penjualan</h3>
            <p className="text-2xl">
              Rp. {stats.totalPenjualan.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pesanan Baru</h3>
            <p className="text-2xl">{stats.pesananBaru}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Stok Menipis</h3>
            <p className="text-2xl">{stats.stokMenipis} Produk</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <MonthlyIncomeChart />
        </div>
      </main>
    </div>
  );
}

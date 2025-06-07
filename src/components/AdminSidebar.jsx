import { Link } from "react-router-dom";

export default function AdminSidebar() {
  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    // Remove auth header
    delete api.defaults.headers.common["Authorization"];
    navigate("/login/admin");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold mb-8">TOKO ILHAM</h1>
      <nav className="space-y-2">
        <Link
          to="/admin"
          className="block py-2.5 px-4 rounded hover:bg-blue-700"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="block py-2.5 px-4 rounded bg-blue-700"
        >
          Manajemen Produk
        </Link>
        <Link
          to="/admin/orders"
          className="block py-2.5 px-4 rounded hover:bg-blue-700"
        >
          Manajemen Pesanan
        </Link>
        <Link
          to="/admin/reports"
          className="block py-2.5 px-4 rounded hover:bg-blue-700"
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
}

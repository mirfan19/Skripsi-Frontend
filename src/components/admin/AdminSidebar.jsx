import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaBox, FaUserTie, FaShoppingCart, FaChartBar, FaThLarge, FaSignOutAlt } from "react-icons/fa";
import api from "../../api/axios";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login/admin");
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: <FaThLarge /> },
    { to: "/admin/products", label: "Manajemen Produk", icon: <FaBox /> },
    { to: "/admin/suppliers", label: "Manajemen Supplier", icon: <FaUserTie /> },
    { to: "/admin/orders", label: "Manajemen Pesanan", icon: <FaShoppingCart /> },
    { to: "/admin/reports", label: "Laporan Keuangan", icon: <FaChartBar /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md md:hidden shadow-lg"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-blue-600 text-white z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto shadow-2xl md:shadow-none`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-10 tracking-tight flex items-center">
            <span className="bg-white text-blue-600 p-1.5 rounded-lg mr-2">TI</span>
            TOKO ILHAM
          </h1>
          
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 hover:bg-blue-700 active:scale-95 group"
              >
                <span className="text-blue-200 group-hover:text-white">{link.icon}</span>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-blue-700 md:bg-transparent">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md active:scale-95"
          >
            <FaSignOutAlt />
            <span className="font-bold text-sm">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}

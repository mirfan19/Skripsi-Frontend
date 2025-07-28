import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function ManajemenReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("add"); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    income: "",
    expenses: "",
    gross_revenue: "",
    net_revenue: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/financialReports");
      setReports(response.data);
    } catch (err) {
      setError("Gagal memuat data laporan keuangan");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setFormType("add");
    setFormData({
      income: "",
      expenses: "",
      gross_revenue: "",
      net_revenue: "",
      date: "",
    });
    setShowForm(true);
    setEditId(null);
  };

  const handleEditClick = (report) => {
    setFormType("edit");
    setFormData({
      income: report.income,
      expenses: report.expenses,
      gross_revenue: report.gross_revenue,
      net_revenue: report.net_revenue,
      date: report.date ? report.date.substring(0, 10) : "",
    });
    setShowForm(true);
    setEditId(report.ReportID);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) return;
    try {
      await api.delete(`/financialReports/${id}`);
      fetchReports();
    } catch (err) {
      setError("Gagal menghapus laporan");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === "add") {
        await api.post("/financialReports", formData);
      } else {
        await api.put(`/financialReports/${editId}`, formData);
      }
      setShowForm(false);
      fetchReports();
    } catch (err) {
      setError("Gagal menyimpan laporan");
    }
  };

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
              className="block py-2.5 px-4 rounded text-white hover:bg-blue-700"
            >
              Manajemen Pesanan
            </Link>
            <Link
              to="/admin/reports"
              className="block py-2.5 px-4 rounded bg-blue-700 text-white"
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
          <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
            Laporan Keuangan
            <button
              onClick={handleAddClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Tambah Laporan
            </button>
          </h1>
          {showForm && (
            <form
              onSubmit={handleFormSubmit}
              className="mb-6 bg-gray-50 p-4 rounded shadow"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Tanggal</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Income</label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Expenses</label>
                  <input
                    type="number"
                    name="expenses"
                    value={formData.expenses}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Gross Revenue
                  </label>
                  <input
                    type="number"
                    name="gross_revenue"
                    value={formData.gross_revenue}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Net Revenue
                  </label>
                  <input
                    type="number"
                    name="net_revenue"
                    value={formData.net_revenue}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      ReportID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">
                      Income
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">
                      Gross Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">
                      Net Revenue
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.ReportID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{report.ReportID}</td>
                      <td className="px-6 py-4">
                        {report.date
                          ? new Date(report.date).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        Rp {Number(report.income).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        Rp {Number(report.expenses).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        Rp{" "}
                        {Number(report.gross_revenue).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        Rp {Number(report.net_revenue).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEditClick(report)}
                          className="text-blue-600 hover:text-blue-800 mx-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(report.ReportID)}
                          className="text-red-600 hover:text-red-800 mx-2"
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
        </div>
      </div>
    </div>
  );
}

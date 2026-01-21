import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

const AdminSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("suppliers");
      setSuppliers(res.data);
    } catch (err) {
      setError("Gagal mengambil data supplier");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Add supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Sesuaikan payload dengan field backend
      await axios.post("suppliers", {
        SupplierName: supplierName,
        Address: address,
        ContactName: "-", // atau bisa tambahkan input jika ingin
        Phone: "-", // default jika tidak ada input
        Email: `${Date.now()}@dummy.com`, // agar unique, bisa diganti sesuai kebutuhan
      });
      setSuccess("Supplier berhasil ditambahkan");
      setSupplierName("");
      setAddress("");
      fetchSuppliers();
    } catch (err) {
      setError("Gagal menambah supplier");
    }
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus supplier?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`suppliers/${id}`);
      setSuccess("Supplier berhasil dihapus");
      fetchSuppliers();
    } catch (err) {
      setError("Gagal menghapus supplier");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 md:ml-64 mt-14 md:mt-0">
        <h2 className="text-xl font-bold mb-4">Manajemen Supplier</h2>
        <form
          onSubmit={handleAddSupplier}
          className="mb-6 bg-white p-4 rounded shadow"
        >
          <div className="mb-2">
            <label className="block mb-1">Nama Supplier</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Alamat</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="border p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tambah Supplier
          </button>
        </form>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Daftar Supplier</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Nama</th>
                  <th className="border px-2 py-1">Alamat</th>
                  <th className="border px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.SupplierID}>
                    <td className="border px-2 py-1">{s.SupplierName}</td>
                    <td className="border px-2 py-1">{s.Address}</td>
                    <td className="border px-2 py-1">
                      <button
                        onClick={() => handleDelete(s.SupplierID)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupplier;

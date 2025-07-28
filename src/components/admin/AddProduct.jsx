import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ProductName: "",
    Description: "",
    Price: "",
    StockQuantity: "",
    Category: "",
    SupplierID: "", // Add this
    Image: null,
  });
  const [suppliers, setSuppliers] = useState([]); // Add this
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get("/suppliers");
        console.log("Suppliers fetched:", response.data);
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers");
      }
    };

    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Image") {
      setFormData((prev) => ({
        ...prev,
        Image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Form Data:", formData);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "Image" && formData[key]) {
          formDataToSend.append("Image", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Debug log
      console.log("FormData entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await api.post("/admin/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        navigate("/admin/products");
      } else {
        setError(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6"
          >
            {error && (
              <div className="mb-4 bg-red-100 text-red-600 p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="ProductName"
                  value={formData.ProductName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Jumlah Stok
                </label>
                <input
                  type="number"
                  name="StockQuantity"
                  value={formData.StockQuantity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Supplier
                </label>
                <select
                  name="SupplierID"
                  value={formData.SupplierID}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.SupplierID}
                      value={supplier.SupplierID}
                    >
                      {supplier.SupplierName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gambar Produk
                </label>
                <input
                  type="file"
                  name="Image"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

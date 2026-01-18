import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { STATIC_BASE_URL } from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ProductName: "",
    Description: "",
    Price: "",
    StockQuantity: "",
    SupplierID: "",
    Category: "Lainnya",
    Image: null,
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        try {
          console.log('Fetching product with ID:', id);
          const productResponse = await api.get(`/admin/products/${id}`);
          console.log('Product response:', productResponse.data);

          const product = productResponse.data?.data;
          if (!product) throw new Error("Product not found");

          setFormData({
            ProductName: product.ProductName,
            Description: product.Description,
            Price: product.Price.toString(),
            StockQuantity: product.StockQuantity.toString(),
            SupplierID: product.SupplierID?.toString() || "",
            Category: product.Category || "Lainnya",
            Image: null,
          });
          setCurrentImage(
            product.ImageURL
              ? product.ImageURL.startsWith("http")
                ? product.ImageURL
                : `${STATIC_BASE_URL}${
                    product.ImageURL
                  }`
              : ""
          );
        } catch (productError) {
          console.error("Failed to fetch product:", productError);
          throw productError; // Re-throw to trigger outer catch
        }

        // Fetch supplier data
        try {
          console.log('Fetching suppliers...');
          const supplierResponse = await api.get("/admin/suppliers");
          console.log('Suppliers response:', supplierResponse.data);
          setSuppliers(supplierResponse.data);
        } catch (supplierError) {
          console.error("Failed to fetch suppliers:", supplierError);
          // Don't throw - allow page to load even if suppliers fail
          setSuppliers([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        
        let errorMessage = "Failed to fetch product details";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      console.log("Image file selected:", files[0]?.name);
      setFormData((prev) => ({
        ...prev,
        Image: files[0], // Keep using Image in state to maintain consistency
      }));
    } else {
      console.log(`Field ${name} changed:`, value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Sanitize price: replace comma with dot, remove invalid chars
      let sanitizedPrice = formData.Price;
      if (typeof sanitizedPrice === "string") {
        sanitizedPrice = sanitizedPrice
          .replace(",", ".")
          .replace(/[^0-9.]/g, "");
      }

      const fieldsToSend = {
        ProductName: formData.ProductName,
        Description: formData.Description,
        Price: sanitizedPrice,
        StockQuantity: formData.StockQuantity,
        SupplierID: formData.SupplierID,
        Category: formData.Category || "Lainnya",
      };

      Object.entries(fieldsToSend).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (formData.Image) {
        formDataToSend.append("image", formData.Image);
      }

      console.log("Sending form data:", {
        ...fieldsToSend,
        image: formData.Image ? formData.Image.name : "No new image",
      });

      const response = await api.put(`/admin/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        navigate("/admin/products");
      } else {
        throw new Error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      let errorMessage = "Failed to update product. Please try again.";
      
      console.error("Full error object:", error);

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(String(errorMessage));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6"
          >
            {error ? (
              <div className="mb-4 bg-red-100 text-red-600 p-3 rounded">
                {String(error)}
              </div>
            ) : null}

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
                  Supplier
                </label>
                <select
                  name="SupplierID"
                  value={formData.SupplierID}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.SupplierID}
                      value={supplier.SupplierID}
                    >
                      {supplier.SupplierName}
                    </option>
                  ))}
                </select>
                {suppliers.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Could not load suppliers. Please refresh the page.
                  </p>
                )}
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
                  Gambar Produk
                </label>
                {currentImage && (
                  <div className="mb-2">
                    <img
                      src={currentImage}
                      alt="Current product"
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/product-placeholder.png";
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
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
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

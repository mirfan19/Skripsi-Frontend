import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function PesananDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (err) {
        setError("Gagal memuat detail pesanan");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const updateStatus = async (status) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status });
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      setError("Gagal memperbarui status pesanan");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/orders/${orderId}`);
      navigate("/admin/orders");
    } catch (err) {
      setError("Gagal menghapus pesanan");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">
          Detail Pesanan #{order.OrderID}
        </h2>
        <div className="mb-4">
          <div>
            <b>Pelanggan:</b> {order.User?.Username}
          </div>
          <div>
            <b>Total:</b> Rp. {order.TotalAmount?.toLocaleString("id-ID")}
          </div>
          <div>
            <b>Status:</b>{" "}
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
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2">Produk yang Dibeli:</h3>
          <ul className="list-disc pl-5">
            {order.OrderItems && order.OrderItems.length > 0 ? (
              order.OrderItems.map((item) => (
                <li key={item.OrderItemID}>
                  {item.Product?.ProductName} x {item.Quantity} @ Rp.{" "}
                  {Number(item.Price).toLocaleString("id-ID")}
                </li>
              ))
            ) : (
              <li>Tidak ada produk</li>
            )}
          </ul>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => updateStatus("Menunggu")}
            className={`px-4 py-2 rounded ${
              order.Status === "Menunggu"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => updateStatus("Diproses")}
            className={`px-4 py-2 rounded ${
              order.Status === "Diproses"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => updateStatus("Selesai")}
            className={`px-4 py-2 rounded ${
              order.Status === "Selesai"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800"
            }`}
          >
            Selesai
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <div className="mb-4">Yakin ingin menghapus pesanan ini?</div>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Ya, hapus
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

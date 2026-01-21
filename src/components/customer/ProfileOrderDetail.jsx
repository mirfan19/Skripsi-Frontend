import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ProfileOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <b>Tanggal:</b> {new Date(order.OrderDate).toLocaleDateString()}
          </div>
          <div>
            <b>Status:</b> {order.Status}
          </div>
          <div>
            <b>Total:</b> Rp. {order.TotalAmount?.toLocaleString("id-ID")}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2">Produk yang Dibeli:</h3>
          <ul className="list-disc pl-5">
            {order.OrderItems && order.OrderItems.length > 0 ? (
              order.OrderItems.map((item) => (
                <li key={item.OrderItemID} className="mb-1">
                  {item.Product?.ProductName} x {item.Quantity} @ Rp.{" "}
                  {Number(item.Price).toLocaleString("id-ID")}
                </li>
              ))
            ) : (
              <li>Tidak ada produk</li>
            )}
          </ul>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

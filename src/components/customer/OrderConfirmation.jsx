import { useLocation, Navigate } from "react-router-dom";
import Header from "./Header";

export default function OrderConfirmation() {
  const location = useLocation();
  const { orderDetails, paymentResult } = location.state || {};

  // Redirect if there's no order details
  if (!orderDetails) {
    return <Navigate to="/" replace />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const formatPaymentMethod = (method) => {
    switch (method) {
      case "dompet_digital":
        return "Dompet Digital";
      case "transfer_bank":
        return "Transfer Bank";
      case "bayar_ditempat":
        return "Bayar di Tempat";
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          {/* Confirmation Message */}
          <h2 className="text-2xl font-bold text-center mb-4">
            Terima Kasih telah memesan
          </h2>{" "}
          <p className="text-gray-600 text-center mb-6">
            Konfirmasi pemesanan telah dikirim ke email Anda
          </p>
          {/* Order Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-4">Detail Pesanan</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal transaksi</span>
                <span>{new Date().toLocaleDateString("id-ID")}</span>
              </div>{" "}
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span>{formatPaymentMethod(orderDetails.paymentMethod)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold">
                  Rp {orderDetails.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-semibold ${getStatusColor(
                    orderDetails.status
                  )}`}
                >
                  {orderDetails.status === "success"
                    ? "Pembayaran Berhasil"
                    : orderDetails.status === "pending"
                    ? "Menunggu Pembayaran"
                    : "Status Tidak Diketahui"}
                </span>
              </div>
              {orderDetails.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID</span>
                  <span>{orderDetails.paymentId}</span>
                </div>
              )}
            </div>
          </div>{" "}
          {/* Payment Details (for online payments) */}
          {paymentResult && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="text-lg font-semibold mb-4">
                Detail Pembayaran Online
              </h3>
              <div className="space-y-3">
                {paymentResult.transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span>{paymentResult.transaction_id}</span>
                  </div>
                )}
                {paymentResult.payment_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Type</span>
                    <span className="capitalize">
                      {paymentResult.payment_type.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
                {paymentResult.status_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Code</span>
                    <span>{paymentResult.status_code}</span>
                  </div>
                )}
                {paymentResult.transaction_time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Time</span>
                    <span>
                      {new Date(paymentResult.transaction_time).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}{" "}
          {/* Navigation Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Lanjutkan Belanja
            </button>
            {orderDetails.status === "pending" && (
              <button
                onClick={() => (window.location.href = "/payment")}
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Selesaikan Pembayaran
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

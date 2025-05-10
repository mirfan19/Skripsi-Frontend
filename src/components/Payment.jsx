import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import api from "../api/axios";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    try {
      const response = await api.post("/api/payments", {
        OrderID: orderDetails.orderId,
        PaymentMethod: paymentMethod,
        Amount: orderDetails.totalAmount,
        Status: "Pending",
      });

      if (response.data.success) {
        // Redirect to confirmation page
        navigate("/order-confirmation", {
          state: {
            orderDetails: {
              ...orderDetails,
              paymentId: response.data.data.PaymentID,
              paymentMethod: paymentMethod,
            },
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  if (!orderDetails) {
    return navigate("/checkout");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
          <div className="mb-6">
            <p className="text-gray-600">
              Total Pembayaran: Rp{" "}
              {orderDetails.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="dompet_digital"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span>Dompet Digital</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer_bank"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span>Transfer Bank</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bayar_ditempat"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span>Bayar di tempat</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={!paymentMethod}
            >
              Konfirmasi Pembayaran
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

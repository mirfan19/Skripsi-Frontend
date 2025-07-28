import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import api from "../../api/axios";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  // Add Midtrans snap
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    );
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create payment
      const response = await api.post("/payments", {
        OrderID: orderDetails.orderId,
        PaymentMethod: paymentMethod,
        Amount: parseFloat(orderDetails.totalAmount),
        Status: "Pending",
      });

      if (response.data.success) {
        if (paymentMethod === "bayar_ditempat") {
          // Handle cash on delivery
          navigate("/order-confirmation", {
            state: {
              orderDetails: {
                ...orderDetails,
                paymentId: response.data.data.PaymentID,
                paymentMethod: paymentMethod,
                status: "pending",
              },
            },
          });
        } else {
          // Handle Midtrans payment
          const token = response.data.data.token;
          window.snap.pay(token, {
            onSuccess: function (result) {
              navigate("/order-confirmation", {
                state: {
                  orderDetails: {
                    ...orderDetails,
                    paymentId: response.data.data.PaymentID,
                    paymentMethod: paymentMethod,
                    status: "success",
                  },
                  paymentResult: result,
                },
              });
            },
            onPending: function (result) {
              navigate("/order-confirmation", {
                state: {
                  orderDetails: {
                    ...orderDetails,
                    paymentId: response.data.data.PaymentID,
                    paymentMethod: paymentMethod,
                    status: "pending",
                  },
                  paymentResult: result,
                },
              });
            },
            onError: function (error) {
              console.error("Payment error:", error);
              alert("Payment failed: " + (error.message || "Unknown error"));
              setIsLoading(false);
            },
            onClose: function () {
              alert("Payment cancelled");
              setIsLoading(false);
            },
          });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setIsLoading(false);
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
              disabled={!paymentMethod || isLoading}
            >
              {isLoading ? "Processing..." : "Konfirmasi Pembayaran"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

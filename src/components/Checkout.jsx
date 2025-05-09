import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    additionalInfo: "",
  });

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await api.get(`/api/cart/user/${userId}`);
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.Product.Price * item.Quantity;
    }, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.post("/api/orders", {
        userId,
        items: cartItems,
        shippingDetails: formData,
      });

      if (response.data.success) {
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const steps = [
    { id: 1, name: "Cart" },
    { id: 2, name: "Checkout" },
    { id: 3, name: "Payment" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav
          className="flex items-center justify-center mb-8"
          aria-label="Progress"
        >
          <ol className="flex items-center space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className="flex items-center">
                <div className="relative flex items-center">
                  <div
                    className={`${
                      stepIdx === 1 ? "bg-blue-600" : "bg-gray-300"
                    } rounded-full h-8 w-8 flex items-center justify-center`}
                  >
                    <span className="text-white">{step.id}</span>
                  </div>
                  <span
                    className={`ml-4 text-sm font-medium ${
                      stepIdx === 1 ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="ml-8 hidden md:block">
                    <div className="h-0.5 w-16 bg-gray-300"></div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Payment Form */}
          <div className="md:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Pembayaran</h2>
              <form onSubmit={handleSubmitOrder}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      No. HP
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Informasi Tambahan
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Pesanan</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.CartID} className="flex justify-between">
                    <span>{item.Product.ProductName}</span>
                    <span>
                      Rp{" "}
                      {(item.Product.Price * item.Quantity).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp {calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150"
                >
                  Membuat pesanan
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-150"
                >
                  Kembali ke cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

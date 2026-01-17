import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import api from "../../api/axios";
import Header from "./Header";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      // Correct the API endpoint
      const response = await api.get(`/cart/user/${userId}`); // Removed extra `/api`
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      setError("Failed to load cart");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      await api.put(`/cart/${cartId}`, { Quantity: newQuantity });
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (cartId) => {
    try {
      const response = await api.delete(`/cart/${cartId}`);
      if (response.data.success) {
        alert("Item removed from cart!");
        fetchCart();
      } else {
        alert(response.data.message || "Failed to remove item from cart");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item from cart");
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }
      const response = await api.post("/cart/add", {
        UserID: userId,
        ProductID: productId,
        Quantity: quantity,
      });
      if (response.data.success) {
        alert("Product added to cart!");
        fetchCart();
      } else {
        alert(response.data.message || "Failed to add product to cart");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.Product.Price * item.Quantity;
    }, 0);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const steps = [
    { id: 1, name: "Cart" },
    { id: 2, name: "Checkout" },
    { id: 3, name: "Payment" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-center py-4 mb-8"
          aria-label="Progress"
        >
          <ol className="flex items-center space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className="flex items-center">
                <div className="relative flex items-center">
                  <div
                    className={`${
                      stepIdx === 0 ? "bg-blue-600" : "bg-gray-300"
                    } rounded-full h-8 w-8 flex items-center justify-center`}
                  >
                    <span className="text-white">{step.id}</span>
                  </div>
                  <span
                    className={`ml-4 text-sm font-medium ${
                      stepIdx === 0 ? "text-blue-600" : "text-gray-500"
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

        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left">Product</th>
                        <th className="text-right">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-right">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.CartID} className="border-b">
                          <td className="py-4 flex items-center">
                            <img
                              src={
                                item.Product.ImageURL
                                  ? item.Product.ImageURL.startsWith("http")
                                    ? item.Product.ImageURL
                                    : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${
                                        item.Product.ImageURL
                                      }`
                                  : "/product-placeholder.png"
                              }
                              alt={item.Product.ProductName}
                              className="w-16 h-16 object-cover rounded mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/product-placeholder.png";
                              }}
                            />
                            <span>{item.Product.ProductName}</span>
                          </td>
                          <td className="text-right">
                            Rp {item.Product.Price.toLocaleString("id-ID")}
                          </td>
                          <td className="text-center">
                            <div className="flex justify-center items-center">
                              <button
                                onClick={() =>
                                  updateQuantity(item.CartID, item.Quantity - 1)
                                }
                                className="px-2 py-1 bg-gray-100 rounded-l"
                                disabled={item.Quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-4">{item.Quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.CartID, item.Quantity + 1)
                                }
                                className="px-2 py-1 bg-gray-100 rounded-r"
                                disabled={
                                  item.Quantity >= item.Product.StockQuantity
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-right">
                            Rp{" "}
                            {(
                              item.Product.Price * item.Quantity
                            ).toLocaleString("id-ID")}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => removeItem(item.CartID)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      Rp {calculateSubtotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        Rp {calculateSubtotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full mt-4 bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

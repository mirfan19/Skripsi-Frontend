import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import api from "../../api/axios";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }
        const response = await api.get(`/users/${userId}`);
        setUserData(response.data);
        // Handle the user data structure from the backend
        const userData = response.data;
        setFormData({
          Username: userData.Username || "",
          Email: userData.Email || "",
          Phone: userData.Phone || "",
          Address: userData.Address || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    const fetchOrderHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const response = await api.get(`/users/${userId}/orders`);
        setOrderHistory(response.data.data || []);
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchUserData();
    fetchOrderHistory();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      await api.put(`/users/${userId}`, formData);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      // Update userData to reflect changes
      setUserData((prev) => ({
        ...prev,
        ...formData,
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
              {successMessage}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="Username"
                  value={formData.Username}
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
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {userData.Username}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{userData.Email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {userData.Phone || "Not provided"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {userData.Address || "Not provided"}
                </p>
              </div>
            </div>
          )}

          {/* Order History Section */}
          {orderHistory.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Riwayat Pesanan</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow text-sm md:text-base">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Tanggal</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Detail Produk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.OrderID} className="align-top border-t">
                        <td className="px-4 py-2 font-medium">#{order.OrderID}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {new Date(order.OrderDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-right">
                          Rp {order.TotalAmount?.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.Status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.Status}
                          </span>
                        </td>
                        <td className="px-4 py-2 min-w-[200px]">
                          <ul className="list-disc pl-4 space-y-1">
                            {order.OrderItems && order.OrderItems.length > 0 ? (
                              order.OrderItems.map((item) => (
                                <li key={item.OrderItemID} className="text-xs">
                                  {item.Product?.ProductName} <span className="text-gray-500 text-[10px] ml-1">x{item.Quantity}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs">Tidak ada produk</li>
                            )}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

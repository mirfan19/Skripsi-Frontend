import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        setErrorMessage("Please enter both username and password");
        return;
      }

      console.log("Attempting admin login...");
      const response = await api.post("/auth/login", {
        username,
        password,
        isAdmin: true,
      });

      console.log("Login response:", response.data);

      if (!response.data?.success) {
        setErrorMessage(response.data?.message || "Login failed");
        return;
      }

      const { token, user } = response.data.data;

      if (!user || user.role !== "admin") {
        setErrorMessage("Unauthorized: Admin access only");
        return;
      }

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role); // harus "admin"
      localStorage.setItem("userId", user.id);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Navigate to admin dashboard
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed: Please check your credentials."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg mx-4"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8 text-center"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/Toko Ilham Logo.png" alt="Logo" className="w-1/2 md:w-3/4" />
        </motion.div>

        <div className="md:w-1/2 p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">TOKO ILHAM</h1>
          <p className="mb-4 text-lg font-semibold text-center">Admin Login</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {errorMessage}
              </div>
            )}
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border p-2 rounded"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login as Admin
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

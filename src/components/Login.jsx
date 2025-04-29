// src/pages/Login.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState(""); // Change to 'username'
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });
      console.log("Login response:", response);
      localStorage.setItem("token", response.data.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Username or password is incorrect. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left - Image */}
        <motion.div
          className="w-1/2 bg-gray-100 flex items-center justify-center p-4"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/bike.png" alt="Bike" className="w-3/4" />
        </motion.div>

        {/* Right - Form */}
        <div className="w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">TOKO ILHAM</h1>
          <p className="mb-4 text-lg font-semibold text-center">
            Toko Serba Ada, Fotocopy, dan Alat Tulis Kantor
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Display error message */}
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
                placeholder="Enter your username"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" /> Remember Me
              </label>
              <a href="#" className="text-sm text-blue-600">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

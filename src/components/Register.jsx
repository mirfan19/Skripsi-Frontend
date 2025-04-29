// src/pages/Register.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        email,
        username,
        phone,
        password,
      });

      // If registration is successful
      setSuccessMessage("Account successfully registered!");
      setErrorMessage(""); // Clear any previous error messages

      // Clear form fields
      setEmail("");
      setUsername("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Handle errors (e.g., duplicate email or username)
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      setSuccessMessage(""); // Clear success message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left - Image */}
        <motion.div
          className="w-1/2 bg-gray-100 flex items-center justify-center p-4"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/bike.png" alt="Bike" className="w-3/4" />
        </motion.div>

        {/* Right - Form */}
        <div className="w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">TOKO ILHAM</h1>
          <p className="mb-4 text-lg font-semibold text-center">
            Daftar Akunmu
          </p>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Display error message */}
            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {errorMessage}
              </div>
            )}

            {/* Display success message */}
            {successMessage && (
              <div className="bg-green-100 text-green-600 p-2 rounded text-sm">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">No. HP</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxx"
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
                placeholder="********"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <Link to="/login" className="text-sm text-blue-600">
                Login
              </Link>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

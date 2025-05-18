import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        if (adminOnly && role !== "admin") {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await api.get("/auth/check-role");
        if (adminOnly) {
          setIsAuthenticated(response.data.data.role === "admin");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={adminOnly ? "/login/admin" : "/login"} replace />
  );
}

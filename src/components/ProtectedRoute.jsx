import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/check-role");
        const role = response.data.data.role;
        localStorage.setItem("role", role); // Update the role in localStorage

        if (isAdminRoute && role !== "admin") {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        // Clear all auth data on error
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [isAdminRoute]);

  if (isLoading) {
    // You could return a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (isAdminRoute) {
      return <Navigate to="/login/admin" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

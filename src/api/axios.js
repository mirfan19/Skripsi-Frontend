
// DEBUG: log env
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
import axios from "axios";

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Derive static base URL (strip /api/v1 or /api)
// This ensures that images can be fetched from the root of the backend
export const STATIC_BASE_URL = import.meta.env.VITE_API_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');

console.log("Using API_BASE_URL:", API_BASE_URL);
console.log("Using STATIC_BASE_URL for images:", STATIC_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // optional: add an idempotency key for POSTs to help dedup on server
    if (config.method === "post" && !config.headers["Idempotency-Key"]) {
      config.headers["Idempotency-Key"] = cryptoRandomId();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function cryptoRandomId() {
  try {
    const arr = new Uint8Array(12);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(arr);
    } else {
      require("crypto").randomFillSync(arr);
    }
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
}

// ...existing code...

export default api;
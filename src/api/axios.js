
// DEBUG: log env
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api/v1";
console.log("AXIOS BASEURL:", baseURL);
const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // important if backend uses cookies/sessions
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
      window.location.href = "/login/admin";
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

export default api;
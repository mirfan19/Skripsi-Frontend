import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import Wishlist from "./components/Wishlist";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import OrderConfirmation from "./components/OrderConfirmation";
import AdminDashboard from "./components/AdminDashboard";
import LoginAdmin from "./components/LoginAdmin";
import ManajemenProduk from "./components/ManajemenProduk";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Profile from "./components/Profile";
import ManajemenPesanan from "./components/ManajemenPesanan";
import ManajemenReport from "./components/ManajemenReport";
import PesananDetail from "./components/PesananDetail";
import ProfileOrderDetail from "./components/ProfileOrderDetail";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        {/* Protected Profile route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Protected customer dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<ManajemenProduk />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/edit/:id" element={<EditProduct />} />
                <Route path="/orders" element={<ManajemenPesanan />} />
                <Route path="/orders/:orderId" element={<PesananDetail />} />
                <Route path="/reports" element={<ManajemenReport />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <ProfileOrderDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;

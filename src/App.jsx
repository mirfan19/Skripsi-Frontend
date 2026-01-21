import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./components/customer/Login";
import Register from "./components/customer/Register";
import Home from "./components/customer/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/customer/Dashboard";
import ProductList from "./components/customer/ProductList";
import Wishlist from "./components/customer/Wishlist";
import ProductDetail from "./components/customer/ProductDetail";
import Cart from "./components/customer/Cart";
import Checkout from "./components/customer/Checkout";
import Payment from "./components/customer/Payment";
import OrderConfirmation from "./components/customer/OrderConfirmation";
import Profile from "./components/customer/Profile";
import PesananDetail from "./components/customer/PesananDetail";
import ProfileOrderDetail from "./components/customer/ProfileOrderDetail";

// Admin imports
import AdminDashboard from "./components/admin/AdminDashboard";
import LoginAdmin from "./components/admin/LoginAdmin";
import ManajemenProduk from "./components/admin/ManajemenProduk";
import AddProduct from "./components/admin/AddProduct";
import EditProduct from "./components/admin/EditProduct";
import ManajemenPesanan from "./components/admin/ManajemenPesanan";
import AdminSupplier from "./components/admin/AdminSupplier";

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
                <Route path="/suppliers" element={<AdminSupplier />} />
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

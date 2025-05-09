import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} /> {/* Add default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} /> {/* Public home route */}
        <Route path="/products" element={<ProductList />} /> {/* New Route */}
        <Route path="/wishlist" element={<Wishlist />} /> {/* New Route */}
        <Route path="/products/:id" element={<ProductDetail />} />{" "}
        {/* New Route */}
        <Route path="/cart" element={<Cart />} /> {/* New Route */}
        <Route path="/checkout" element={<Checkout />} /> {/* New Route */}
        <Route path="/payment" element={<Payment />} /> {/* New Route */}
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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

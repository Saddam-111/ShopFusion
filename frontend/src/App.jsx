import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Register from "./User/Register";
import Login from "./User/Login";
import UserDashboard from "./User/UserDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminUsers from "./Admin/AdminUsers";
import AdminCoupons from "./Admin/AdminCoupons";
import AdminLayout from "./Admin/AdminLayout";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/userSlice";
import { getCart } from "./redux/cartSlice";
import { ThemeProvider } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SocketProvider } from "./context/SocketContext";
import AIChatbot from "./components/AIChatbot";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-art-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-art-gold/30 border-t-art-gold animate-spin rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <SocketProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              theme="dark"
            />
            <Routes>
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/product/:id" element={<><Navbar /><ProductDetails /><Footer /></>} />
              <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
              <Route path="/products/:keyword" element={<><Navbar /><Products /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
              <Route path="/faq" element={<><Navbar /><FAQ /><Footer /></>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
              <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
              <Route path="/profile" element={isAuthenticated ? <UserDashboard user={user} /> : <Navigate to="/login" />} />
              
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
<Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
               
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <AIChatbot />
          </div>
        </Router>
      </ThemeProvider>
    </SocketProvider>
  );
};

export default App;

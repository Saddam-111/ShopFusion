import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./User/Register";
import Login from "./User/Login";
import UserDashboard from "./User/UserDashboard";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/userSlice";



const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);




  return (
    <div>
      <ToastContainer />
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Routes>

          {isAuthenticated && <UserDashboard user={user} />}
      </Router>
    </div>
  );
};




export default App;

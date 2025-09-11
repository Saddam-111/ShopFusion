import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (
    <nav className="bg-[#1f241f] text-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          ShopFusion
        </Link>

        {/* Search Bar (always visible) */}
        <div className="hidden md:flex flex-1 mx-6">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-lg bg-gray-700 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#647a67]"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/products" className="hover:text-white">Products</Link>
          <Link to="/about" className="hover:text-white">About Us</Link>
          <Link to="/contact" className="hover:text-white">Contact Us</Link>
        </div>

        {/* Cart + Profile */}
        <div className="flex items-center space-x-6 ml-6">
          <Link to="/cart" className="hover:text-white flex items-center gap-1">
            <FiShoppingCart size={20} />
            <span className="hidden md:inline">Cart</span>
          </Link>
          {!isAuthenticated && <Link to="/register" className="hover:text-white flex items-center gap-1">
            <FiUser size={20} />
            <span className="hidden md:inline">Sign in</span>
          </Link>}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden ml-4 text-gray-200 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#1f241f] border-t border-gray-700 px-6 py-4 space-y-4">
          <Link to="/" className="block hover:text-white" onClick={toggleMenu}>Home</Link>
          <Link to="/products" className="block hover:text-white" onClick={toggleMenu}>Products</Link>
          <Link to="/about" className="block hover:text-white" onClick={toggleMenu}>About Us</Link>
          <Link to="/contact" className="block hover:text-white" onClick={toggleMenu}>Contact Us</Link>

          {/* Mobile Search */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-lg bg-gray-700 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

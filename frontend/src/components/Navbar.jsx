import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "nav-blur border-b border-forest/10 bg-cream/95" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-4">
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-display text-forest tracking-wider flex-shrink-0"
        >
          <span className="hidden md:inline">-ShopFusion</span>
          <span className="md:hidden">-SF</span>
        </Link>

        {/* Search Bar - Always visible on all screens with better styling */}
        <form onSubmit={handleSearch} className="flex-1 mx-2 md:mx-6">
          <div className="relative w-full min-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 md:pl-12 rounded-full bg-white border-2 border-forest/20 text-forest text-sm placeholder-forest/50 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all"
            />
            <button type="submit" className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-forest/60 hover:text-forest">
              <FiSearch size={18} />
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4 md:gap-8">
          <div className="nav-pill px-4 py-2">
            <div className="flex items-center gap-4 md:space-x-6">
              <Link to="/" className="nav-link text-forest text-xs">Home</Link>
              <Link to="/products" className="nav-link text-forest/70 hover:text-forest text-xs">Products</Link>
              <Link to="/about" className="nav-link text-forest/70 hover:text-forest text-xs">About</Link>
              <Link to="/contact" className="nav-link text-forest/70 hover:text-forest text-xs">Contact</Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link to="/cart" className="relative text-forest hover:text-forest/70 transition-colors p-1">
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest text-cream text-xs font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link text-forest text-xs hidden md:block">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-forest hover:text-forest/70 transition-colors">
                <FiUser size={20} />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="text-forest hover:text-forest/70 transition-colors">
              <FiUser size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-forest focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-cream border-t border-forest/10 px-4 py-4 space-y-4">
          <form onSubmit={(e) => { handleSearch(e); toggleMenu(); }} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pl-10 rounded-lg bg-olive/30 text-forest text-sm placeholder-forest/50"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" size={18} />
            </div>
          </form>
          <Link to="/" className="block text-forest/70 hover:text-forest py-2" onClick={toggleMenu}>Home</Link>
          <Link to="/products" className="block text-forest/70 hover:text-forest py-2" onClick={toggleMenu}>Products</Link>
          <Link to="/about" className="block text-forest/70 hover:text-forest py-2" onClick={toggleMenu}>About Us</Link>
          <Link to="/contact" className="block text-forest/70 hover:text-forest py-2" onClick={toggleMenu}>Contact Us</Link>
          <div className="border-t border-forest/10 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-forest font-semibold py-2" onClick={toggleMenu}>Admin Panel</Link>
                )}
                <Link to="/profile" className="block text-forest/70 hover:text-forest py-2" onClick={toggleMenu}>Profile</Link>
              </div>
            ) : (
              <Link to="/login" className="block text-forest/70 hover:text-forest py-2" onClick={toggleMenu}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
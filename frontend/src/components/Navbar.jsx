import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--accent-gold)]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-art-deco text-[var(--accent-gold)]">
          ShopFusion
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-gold)] border border-transparent transition-all"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-[var(--text-secondary)]">
              <FiSearch size={18} />
            </button>
          </div>
        </form>

        <div className="hidden lg:flex items-center space-x-8 text-sm tracking-wider uppercase">
          <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">Home</Link>
          <Link to="/products" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">Products</Link>
          <Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">About</Link>
          <Link to="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">Contact</Link>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <ThemeToggle />
          <Link to="/cart" className="relative text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--accent-gold)] text-[var(--bg-primary)] text-xs font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-[var(--accent-gold)] hover:text-[var(--accent-gold)] font-semibold text-sm">
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
                <FiUser size={22} />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
              <FiUser size={22} />
            </Link>
          )}
        </div>

        <button
          className="lg:hidden ml-4 text-[var(--text-secondary)] focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[var(--bg-secondary)] border-t border-[var(--accent-gold)]/20 px-6 py-4 space-y-4">
          <form onSubmit={(e) => { handleSearch(e); toggleMenu(); }} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pl-10 rounded bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm placeholder-[var(--text-secondary)]/50"
              />
              <FiSearch className="absolute left-3 top-2.5 text-[var(--text-secondary)]" size={18} />
            </div>
          </form>
          <Link to="/" className="block text-[var(--text-secondary)] hover:text-[var(--accent-gold)]" onClick={toggleMenu}>Home</Link>
          <Link to="/products" className="block text-[var(--text-secondary)] hover:text-[var(--accent-gold)]" onClick={toggleMenu}>Products</Link>
          <Link to="/about" className="block text-[var(--text-secondary)] hover:text-[var(--accent-gold)]" onClick={toggleMenu}>About Us</Link>
          <Link to="/contact" className="block text-[var(--text-secondary)] hover:text-[var(--accent-gold)]" onClick={toggleMenu}>Contact Us</Link>
          <div className="border-t border-[var(--accent-gold)]/20 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-[var(--accent-gold)] font-semibold" onClick={toggleMenu}>Admin Panel</Link>
                )}
                <Link to="/profile" className="block text-[var(--text-secondary)] hover:text-[var(--accent-gold)]" onClick={toggleMenu}>Profile</Link>
              </div>
            ) : (
              <Link to="/login" className="block text-[var(--text-secondary)] hover:text-[var(--accent-gold)]" onClick={toggleMenu}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

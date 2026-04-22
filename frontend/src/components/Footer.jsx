import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-forest text-sage py-16 px-6 md:px-20 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
        <div className="md:col-span-6">
          <h2 className="text-3xl font-display text-sage mb-4">-ShopFusion</h2>
          <p className="text-sage/70 text-sm leading-relaxed min-w-sm">
            Your premium destination for luxury shopping. Discover curated collections with exceptional quality.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center text-sage hover:bg-sage hover:text-forest transition-all">
              <FaFacebookF size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center text-sage hover:bg-sage hover:text-forest transition-all">
              <FaInstagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center text-sage hover:bg-sage hover:text-forest transition-all">
              <FaTwitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center text-sage hover:bg-sage hover:text-forest transition-all">
              <FaLinkedinIn size={18} />
            </a>
          </div>
          
          <div className="mt-8">
            <h3 className="text-sage font-semibold mb-4 text-utility text-xs">Newsletter</h3>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 py-3 px-4 bg-transparent border-b-2 border-sage/30 text-sage placeholder-sage/50 focus:outline-none focus:border-sage transition-colors"
              />
              <button type="submit" className="px-6 py-3 bg-sage text-forest font-bold text-utility text-xs rounded-lg hover:bg-sage/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-3 md:text-right">
          <h3 className="text-sage font-semibold mb-4 text-utility text-xs">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="footer-links hover:text-white">Home</Link></li>
            <li><Link to="/products" className="footer-links hover:text-white">Shop</Link></li>
            <li><Link to="/about" className="footer-links hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="footer-links hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 md:text-right">
          <h3 className="text-sage font-semibold mb-4 text-utility text-xs">Customer Service</h3>
          <ul className="space-y-3">
            <li><Link to="/faq" className="footer-links hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="footer-links hover:text-white">Shipping Policy</Link></li>
            <li><Link to="/contact" className="footer-links hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/contact" className="footer-links hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sage/20 mt-12 pt-2 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sage/30 text-sm gap-2">
            © {new Date().getFullYear()} ShopFusion. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <Link to="/contact" className="text-sage/30 text-sm hover:text-sage/50">Terms</Link>
            <Link to="/contact" className="text-sage/30 text-sm hover:text-sage/50">Privacy</Link>
            <Link to="/contact" className="text-sage/30 text-sm hover:text-sage/50">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] py-10 px-6 md:px-20 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--accent-gold)] mb-4">ShopFusion</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop destination for luxury shopping.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-gold)]">
              <FaFacebookF size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-gold)]">
              <FaInstagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-gold)]">
              <FaTwitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-gold)]">
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--accent-gold)]">Home</Link></li>
            <li><Link to="/products" className="hover:text-[var(--accent-gold)]">Shop</Link></li>
            <li><Link to="/about" className="hover:text-[var(--accent-gold)]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--accent-gold)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-[var(--accent-gold)]">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--accent-gold)]">Shipping Policy</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--accent-gold)]">Terms & Conditions</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--accent-gold)]">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MdLocationOn className="text-[var(--accent-gold)]" />
              <span>123 Market Street, Mumbai, India</span>
            </li>
            <li className="flex items-center space-x-2">
              <MdPhone className="text-[var(--accent-gold)]" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <MdEmail className="text-[var(--accent-gold)]" />
              <span>support@shopfusion.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--accent-gold)]/20 mt-10 pt-4 text-center text-sm text-[var(--text-secondary)]/60">
        © {new Date().getFullYear()} ShopFusion. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

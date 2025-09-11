import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#1f241f] text-gray-300 py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">ShopFusion</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop destination for fashion, lifestyle, and electronics.
            Shop smart, shop with Fusion.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaFacebookF size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaInstagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaTwitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/shop" className="hover:text-white">Shop</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/faq" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/returns" className="hover:text-white">Returns & Refunds</a></li>
            <li><a href="/shipping" className="hover:text-white">Shipping Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MdLocationOn className="text-white" />
              <span>123 Market Street, Mumbai, India</span>
            </li>
            <li className="flex items-center space-x-2">
              <MdPhone className="text-white" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <MdEmail className="text-white" />
              <span>support@shopfusion.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ShopFusion. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

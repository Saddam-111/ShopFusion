import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn, MdSend, MdAccessTime, MdChat, MdHelp, MdBusiness } from 'react-icons/md';
import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaShippingFast, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', department: 'general' });
      setLoading(false);
    }, 1500);
  };

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Customer Support' },
    { value: 'orders', label: 'Order Related' },
    { value: 'returns', label: 'Returns & Refunds' },
    { value: 'partnership', label: 'Business Partnership' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const contactInfo = [
    {
      icon: <MdEmail className="text-2xl" />,
      title: 'Email Us',
      value: 'support@shopfusion.com',
      description: 'We reply within 24 hours'
    },
    {
      icon: <FaWhatsapp className="text-2xl" />,
      title: 'WhatsApp',
      value: '+91 98765 43210',
      description: 'Quick responses 9AM - 9PM'
    },
    {
      icon: <MdPhone className="text-2xl" />,
      title: 'Call Us',
      value: '+91 98765 43210',
      description: 'Mon-Sat: 9AM - 8PM'
    }
  ];

  const supportTopics = [
    { icon: <FaShippingFast />, title: 'Shipping & Delivery', description: 'Track orders, shipping rates, delivery times' },
    { icon: <FaUndo />, title: 'Returns & Refunds', description: 'Return policy, refund status, exchanges' },
    { icon: <FaShieldAlt />, title: 'Payment & Security', description: 'Payment methods, security concerns' },
    { icon: <FaHeadset />, title: 'Account Help', description: 'Login issues, account settings, password reset' }
  ];

  const businessHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM', status: 'Open' },
    { day: 'Saturday', time: '10:00 AM - 6:00 PM', status: 'Open' },
    { day: 'Sunday', time: 'Closed', status: 'Closed' }
  ];

  const socialLinks = [
    { icon: <FaInstagram />, label: 'Instagram', link: 'https://instagram.com/shopfusion' },
    { icon: <FaTwitter />, label: 'Twitter', link: 'https://twitter.com/shopfusion' },
    { icon: <FaLinkedin />, label: 'LinkedIn', link: 'https://linkedin.com/company/shopfusion' },
    { icon: <FaWhatsapp />, label: 'WhatsApp', link: 'https://wa.me/919876543210' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-[var(--accent-gold)]/30"></div>
          <p className="text-[var(--accent-gold)] uppercase tracking-[0.3em] text-sm mb-4">Get In Touch</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[var(--text-primary)] mb-6 leading-tight">
            We'd Love to <span className="text-[var(--accent-gold)] italic">Hear</span> From You
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about our products, need assistance with an order, or want to explore partnership opportunities—our dedicated team is here to help.
          </p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-[var(--accent-gold)]/30 mt-8"></div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]/50 transition-all duration-500 group text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--accent-gold)]/10 rounded-full text-[var(--accent-gold)] mb-4 group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--bg-primary)] transition-all duration-500">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{info.title}</h3>
              <p className="text-[var(--accent-gold)] font-medium">{info.value}</p>
              <p className="text-[var(--text-secondary)] text-sm mt-2">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-lg p-8 border border-[var(--accent-gold)]/20">
            <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">Send us a Message</h2>
            <p className="text-[var(--text-secondary)] mb-6 text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--text-secondary)] text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] text-sm mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--text-secondary)] text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] text-sm mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
                  >
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[var(--text-secondary)] text-sm mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief subject of your inquiry"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[var(--text-secondary)] text-sm mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent-gold)] to-[#b8960c] text-[var(--bg-primary)] font-semibold py-4 rounded-lg hover:shadow-lg hover:shadow-[var(--accent-gold)]/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <MdSend />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <MdAccessTime className="text-[var(--accent-gold)]" />
                Business Hours
              </h3>
              <div className="space-y-3">
                {businessHours.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">{item.day}</span>
                    <span className={`text-sm ${item.status === 'Closed' ? 'text-red-500' : 'text-[var(--accent-gold)]'}`}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help Topics */}
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <MdHelp className="text-[var(--accent-gold)]" />
                Quick Help
              </h3>
              <div className="space-y-3">
                {supportTopics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] cursor-pointer transition-colors">
                    <span className="mt-1 text-[var(--accent-gold)]">{topic.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{topic.title}</p>
                      <p className="text-xs">{topic.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <MdChat className="text-[var(--accent-gold)]" />
                Connect With Us
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-4">Follow us on social media for updates, new arrivals, and exclusive offers.</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office Location Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-8 border border-[var(--accent-gold)]/20">
              <div className="flex items-center gap-3 mb-6">
                <MdBusiness className="text-[var(--accent-gold)] text-2xl" />
                <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Corporate Office</h3>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p className="flex items-start gap-3">
                  <MdLocationOn className="text-[var(--accent-gold)] mt-1" />
                  <span>
                    ShopFusion Technologies Pvt. Ltd.<br />
                    123 Innovation Park, Phase II<br />
                    Andheri East, Mumbai - 400093<br />
                    Maharashtra, India
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <MdPhone className="text-[var(--accent-gold)]" />
                  <span>+91 98765 43210</span>
                </p>
                <p className="flex items-center gap-3">
                  <MdEmail className="text-[var(--accent-gold)]" />
                  <span>corporate@shopfusion.com</span>
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg p-8 border border-[var(--accent-gold)]/20">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Our Presence</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg text-center">
                  <p className="text-2xl font-bold text-[var(--accent-gold)]">5</p>
                  <p className="text-[var(--text-secondary)] text-sm">Warehouse Locations</p>
                </div>
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg text-center">
                  <p className="text-2xl font-bold text-[var(--accent-gold)]">30+</p>
                  <p className="text-[var(--text-secondary)] text-sm">Countries Served</p>
                </div>
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg text-center">
                  <p className="text-2xl font-bold text-[var(--accent-gold)]">100+</p>
                  <p className="text-[var(--text-secondary)] text-sm">City Delivery</p>
                </div>
                <div className="p-4 bg-[var(--bg-primary)] rounded-lg text-center">
                  <p className="text-2xl font-bold text-[var(--accent-gold)]">24h</p>
                  <p className="text-[var(--text-secondary)] text-sm">Avg Response Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-8 border border-[var(--accent-gold)]/20 text-center">
          <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-4">Have More Questions?</h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
            Visit our comprehensive FAQ section to find answers to common questions about orders, shipping, returns, and more.
          </p>
          <Link to="/faq" className="inline-block px-8 py-3 border-2 border-[var(--accent-gold)] text-[var(--accent-gold)] font-semibold rounded-lg hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all">
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
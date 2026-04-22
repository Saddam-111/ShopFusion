import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageCircle, FiStar } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll reply within 24 hours.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const contacts = [
    { icon: <FiMail />, title: 'Email', value: 'support@shopfusion.com', desc: '24/7 reply' },
    { icon: <FiPhone />, title: 'Phone', value: '+91 98765 43210', desc: 'Mon-Sat: 9AM-8PM' },
    { icon: <FaWhatsapp />, title: 'WhatsApp', value: '+91 98765 43210', desc: 'Quick replies' }
  ];

  const quickHelp = [
    { title: 'Shipping', desc: 'Track orders' },
    { title: 'Returns', desc: 'Easy returns' },
    { title: 'Payment', desc: 'Secure pay' },
    { title: 'Account', desc: 'Login help' }
  ];

  const socials = [<FaInstagram />, <FaTwitter />, <FaLinkedin />, <FaWhatsapp />];

  return (
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-sage">
        <div className="noise-overlay" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-forest/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-moss/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
          <h1 className="hero-text text-forest mb-6">
            We'd Love to <span className="text-gradient-primary">Hear</span> From You
          </h1>
          <p className="text-forest/70 text-lg min-w-xl mx-auto">Have questions? We're here to help.</p>
        </div>
      </section>

      <section className="py-12 px-6 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {contacts.map((c, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-corners-lg border border-forest/10 hover:border-forest/30 hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-forest/10 rounded-full text-forest mb-4 text-2xl">{c.icon}</div>
                <h3 className="text-forest font-semibold mb-1">{c.title}</h3>
                <p className="text-forest font-medium">{c.value}</p>
                <p className="text-forest/60 text-sm mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-corners-lg p-8 border border-forest/10">
              <h2 className="text-2xl font-display text-forest mb-2">Send us a Message</h2>
              <p className="text-forest/60 mb-6 text-sm">We reply within 24 hours</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-forest/60 text-sm mb-2">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name"
                      className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-forest/60 text-sm mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                      className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-forest/60 text-sm mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                    className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none" />
                </div>
                <div>
                  <label className="block text-forest/60 text-sm mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="How can we help?"
                    className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none resize-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full btn btn-primary">
                  {loading ? <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" /> : <><FiSend /> Send Message</>}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
                <h3 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2"><FiClock className="text-forest" /> Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-forest/60">Mon-Fri</span><span className="text-forest">9AM-8PM</span></div>
                  <div className="flex justify-between"><span className="text-forest/60">Saturday</span><span className="text-forest">10AM-6PM</span></div>
                  <div className="flex justify-between"><span className="text-forest/60">Sunday</span><span className="text-red-500">Closed</span></div>
                </div>
              </div>

              <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
                <h3 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2"><FiMessageCircle className="text-forest" /> Quick Help</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickHelp.map((h, i) => (
                    <div key={i} className="p-3 bg-olive rounded-lg hover:bg-moss/30 cursor-pointer transition-all">
                      <p className="text-forest text-sm font-medium">{h.title}</p>
                      <p className="text-forest/60 text-xs">{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
                <h3 className="text-lg font-semibold text-forest mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socials.map((s, i) => (
                    <a key={i} href="#" className="inline-flex items-center justify-center w-10 h-10 bg-forest/10 rounded-full text-forest hover:bg-forest hover:text-cream transition-all">
                      {s}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
                <h3 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2"><FiMapPin className="text-forest" /> Office</h3>
                <p className="text-forest/60 text-sm">ShopFusion Technologies Pvt. Ltd.<br />123 Innovation Park<br />Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
import React from 'react';
import { Link } from 'react-router-dom';
import { MdStorefront, MdVerified, MdSupport, MdLocalShipping, MdArrowForward, MdSchedule } from 'react-icons/md';
import { FaAward, FaHandshake, FaLeaf } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <MdStorefront className="text-4xl" />,
      title: "Curated Collection",
      description: "Every product in our collection is handpicked by our expert curators, ensuring only the finest items make it to your virtual shelf."
    },
    {
      icon: <MdVerified className="text-4xl" />,
      title: "Authenticity Guaranteed",
      description: "We partner directly with authorized distributors and brand representatives to ensure 100% authentic products, every single time."
    },
    {
      icon: <MdSupport className="text-4xl" />,
      title: "Concierge Support",
      description: "Our dedicated support team is available around the clock to assist with any queries, from product recommendations to order support."
    },
    {
      icon: <MdLocalShipping className="text-4xl" />,
      title: "White-Glove Delivery",
      description: "Every order is carefully packaged and delivered with express shipping, real-time tracking, and optional same-day delivery in select cities."
    }
  ];

  const stats = [
    { number: "50K+", label: "Satisfied Customers", description: "Across 30+ countries" },
    { number: "10K+", label: "Premium Products", description: "From 200+ luxury brands" },
    { number: "99.7%", label: "Satisfaction Rate", description: "Based on post-purchase surveys" },
    { number: "24/7", label: "Customer Support", description: "Always here to help" }
  ];

  const timeline = [
    { year: "2020", title: "The Beginning", description: "ShopFusion was founded with a vision to democratize luxury shopping." },
    { year: "2021", title: "Expansion", description: "Expanded to 500+ brands and launched our mobile app." },
    { year: "2022", title: "Global Reach", description: "Reached customers in 25 countries worldwide." },
    { year: "2023", title: "Innovation", description: "Introduced AI-powered personal shopping assistant." },
    { year: "2024", title: "Sustainability", description: "Launched eco-friendly packaging initiative." },
    { year: "2025", title: "Milestone", description: "Served our 50,000th customer with premium experience." }
  ];

  const values = [
    { icon: <FaAward />, title: "Excellence", description: "We never settle for mediocrity. Every interaction is an opportunity to exceed expectations." },
    { icon: <FaHandshake />, title: "Trust", description: "Transparency and honesty form the foundation of every relationship we build." },
    { icon: <FaLeaf />, title: "Sustainability", description: "We're committed to minimizing our environmental footprint through conscious practices." }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-[var(--accent-gold)]/30"></div>
          <p className="text-[var(--accent-gold)] uppercase tracking-[0.3em] text-sm mb-4">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[var(--text-primary)] mb-6 leading-tight">
            Redefining <span className="text-[var(--accent-gold)] italic">Luxury</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-3xl mx-auto leading-relaxed">
            What began as a modest vision has transformed into a premier destination for discerning shoppers seeking exceptional quality, unmatched service, and timeless elegance.
          </p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-[var(--accent-gold)]/30 mt-8"></div>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-16 mb-24 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[var(--accent-gold)]/30"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[var(--accent-gold)]/30"></div>
            <div className="aspect-[4/5] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-lg border border-[var(--accent-gold)]/20 p-8 flex items-center justify-center">
              <div className="text-center">
                <span className="text-9xl text-[var(--accent-gold)] font-serif font-bold opacity-80">SF</span>
                <p className="text-[var(--text-secondary)] mt-6 uppercase tracking-[0.2em] text-sm">Est. 2020</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-6">
              A Legacy of <span className="text-[var(--accent-gold)]">Excellence</span>
            </h2>
            <div className="space-y-6">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                ShopFusion was born from a simple yet powerful belief: that everyone deserves access to the world's finest products without compromise. We envisioned a shopping experience that transcends mere transactions—creating moments of joy, discovery, and refinement.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Our founding principles remain unchanged: authenticity without exception, customer obsession without limits, and an unwavering commitment to excellence that permeates every aspect of our operations. From the moment you discover a product to the instant it arrives at your doorstep, we've crafted every step to reflect the sophistication you deserve.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Today, we're proud to serve over 50,000 customers across the globe, offering a curated selection of more than 10,000 products from over 200 prestigious brands. But beyond numbers, we're building a community of individuals who appreciate the finer things in life.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-[var(--accent-gold)]/20">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-gold)]">5+</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Years</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-gold)]">50K+</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-gold)]">200+</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Brands</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-8 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-gold)]/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-gold)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <p className="text-4xl font-bold text-[var(--accent-gold)] mb-2">{stat.number}</p>
              <p className="text-[var(--text-primary)] font-medium">{stat.label}</p>
              <p className="text-[var(--text-secondary)] text-sm mt-1">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <p className="text-[var(--accent-gold)] uppercase tracking-[0.3em] text-sm mb-4">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)]">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]/50 transition-all duration-500 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-gold)]/10 rounded-full text-[var(--accent-gold)] mb-6 text-2xl group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--bg-primary)] transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{value.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <p className="text-[var(--accent-gold)] uppercase tracking-[0.3em] text-sm mb-4">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)]">The ShopFusion Promise</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]/50 transition-all duration-500 group"
              >
                <div className="text-[var(--accent-gold)] mb-4 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <p className="text-[var(--accent-gold)] uppercase tracking-[0.3em] text-sm mb-4">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)]">Milestones That Matter</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline.map((item, index) => (
              <div key={index} className="relative p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]/50 transition-all">
                <div className="absolute -top-3 left-6 px-3 bg-[var(--accent-gold)] text-[var(--bg-primary)] text-sm font-bold">
                  {item.year}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-4 mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 border-t border-b border-[var(--accent-gold)]/20">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">
            Ready to Experience <span className="text-[var(--accent-gold)]">Luxury</span>?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers who have discovered the joy of premium shopping at ShopFusion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--accent-gold)] to-[#b8960c] text-[var(--bg-primary)] font-semibold transition-all hover:shadow-lg hover:shadow-[var(--accent-gold)]/30"
            >
              Explore Collection
              <MdArrowForward />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[var(--accent-gold)] text-[var(--accent-gold)] font-semibold transition-all hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)]"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
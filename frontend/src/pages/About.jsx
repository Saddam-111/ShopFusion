import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiShield, FiClock, FiUsers, FiPackage, FiStar, FiZap } from 'react-icons/fi';

const About = () => {
  const stats = [
    { icon: <FiUsers />, number: "50K+", label: "Customers" },
    { icon: <FiPackage />, number: "10K+", label: "Products" },
    { icon: <FiStar />, number: "99.7%", label: "Satisfaction" },
    { icon: <FiClock />, number: "24/7", label: "Support" }
  ];

  const values = [
    { icon: <FiAward />, title: "Excellence" },
    { icon: <FiShield />, title: "Trust" },
    { icon: <FiStar />, title: "Quality" }
  ];

  const timeline = [
    { year: "2020", title: "Started" },
    { year: "2021", title: "Growth" },
    { year: "2023", title: "Innovation" },
    { year: "2025", title: "Milestone" }
  ];

  return (
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-sage">
        <div className="noise-overlay" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-forest/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-moss/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
          <h1 className="hero-text text-forest mb-6">
            Redefining <span className="text-gradient-primary">Luxury</span> Tech
          </h1>
          <p className="text-forest/70 text-lg min-w-xl mx-auto mb-8">
            Premium electronics for the modern lifestyle.
          </p>
          <Link to="/contact" className="btn btn-secondary">
            Get in Touch <FiArrowRight />
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-corners-lg border border-forest/10 hover:border-forest/30 hover:-translate-y-1 transition-all duration-300">
                <div className="text-forest mb-2 flex justify-center">{s.icon}</div>
                <p className="text-3xl md:text-4xl font-display text-forest">{s.number}</p>
                <p className="text-forest/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-forest/30" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-forest/30" />
              <div className="bg-olive rounded-corners-lg p-12 border border-forest/20 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FiZap className="text-8xl text-forest mx-auto mb-4" />
                  <p className="text-forest text-2xl font-display">Est. 2020</p>
                  <p className="text-forest/60 mt-2">Premium Shopping</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-display text-forest mb-6">
                Our <span className="text-forest">Journey</span>
              </h2>
              <p className="text-forest/70 mb-4">
                Founded in 2020 with a vision to make luxury accessible.
              </p>
              <p className="text-forest/70 mb-6">
                Today: 50K+ customers, 10K+ products, 200+ brands worldwide.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-forest/20">
                {[
                  { num: "5+", label: "Years" },
                  { num: "200+", label: "Brands" },
                  { num: "30+", label: "Countries" }
                ].map((x, i) => (
                  <div key={i} className="text-center p-4 bg-white rounded-corners-lg hover:-translate-y-1 transition-all">
                    <p className="text-2xl font-display text-forest">{x.num}</p>
                    <p className="text-forest/60 text-sm">{x.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-olive">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-forest">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-corners-lg border border-transparent hover:border-forest/30 hover:-translate-y-2 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-forest/10 rounded-full text-forest mb-6 text-2xl">
                  {v.icon}
                </div>
                <h3 className="text-xl font-semibold text-forest">{v.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-forest">Our Milestones</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeline.map((t, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-corners-lg border border-forest/10 hover:border-forest/30 hover:-translate-y-1 transition-all duration-300">
                <p className="text-forest text-2xl font-display mb-2">{t.year}</p>
                <p className="text-forest font-semibold">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative bg-olive rounded-corners-xl p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="section-title text-forest mb-4">Ready to Shop?</h2>
              <p className="text-forest/70 mb-8">Explore our premium collection today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn btn-primary">Shop Now <FiArrowRight /></Link>
                <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
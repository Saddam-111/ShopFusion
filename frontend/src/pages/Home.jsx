import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../redux/productSlice';
import { FiArrowRight, FiShield, FiLock, FiHeadphones, FiTruck, FiStar } from 'react-icons/fi';
import { ProductCard } from '../components/ui/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    dispatch(getProduct({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { name: 'Laptop', icon: '💻', count: '150+' },
    { name: 'Mobile', icon: '📱', count: '200+' },
    { name: 'TV', icon: '📺', count: '80+' },
    { name: 'Camera', icon: '📷', count: '60+' },
    { name: 'Audio', icon: '🎧', count: '120+' },
  ];

  const features = [
    { icon: <FiShield />, title: '100% Authentic' },
    { icon: <FiLock />, title: 'Secure Payment' },
    { icon: <FiHeadphones />, title: '24/7 Support' },
    { icon: <FiTruck />, title: 'Fast Delivery' },
  ];

  return (
    <div className="min-h-screen bg-cream text-forest">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-sage">
        <div className="noise-overlay" />
        
        {/* Floating organic elements with parallax */}
        <div 
          className="absolute top-20 right-[5%] w-32 h-32 md:w-48 md:h-48 rounded-corners-lg bg-olive/40 animate-float hidden sm:block"
          style={{ transform: `translateY(${mousePosition.y * 0.5}px) rotate(${mousePosition.x * 0.3}deg)` }}
        />
        <div 
          className="absolute bottom-32 left-[5%] w-20 h-20 md:w-32 md:h-32 rounded-corners-lg bg-moss/30 animate-float hidden sm:block"
          style={{ transform: `translateY(${mousePosition.y * -0.3}px) rotate(${mousePosition.x * -0.2}deg)`, animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/3 left-[10%] w-16 h-16 md:w-24 md:h-24 rounded-corners-lg bg-forest/20 animate-float hidden sm:block"
          style={{ transform: `translateY(${mousePosition.y * 0.4}px) rotate(${mousePosition.x * 0.4}deg)`, animationDelay: '2s' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10 w-full">
          <div className="min-w-2xl md:min-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-forest/10 border border-forest/20 rounded-full mb-4 md:mb-6">
              <FiStar className="text-forest" size={12} md:size={14} />
              <span className="text-forest text-xs md:text-sm font-semibold text-utility">New Collection 2026</span>
            </div>
            
            {/* Hero Text - Responsive sizing */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display text-forest mb-4 md:mb-6 leading-tight md:leading-none overflow-hidden">
              SHOP<br className="hidden md:block" />
              FUSION
            </h1>
            
            <p className="text-base md:text-xl text-forest/70 mb-6 md:mb-10 min-w-lg">
              Premium electronics & accessories. Quality you trust, prices you'll love.
            </p>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/products" className="btn btn-primary text-sm md:text-base">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary text-sm md:text-base">
                About Us
              </Link>
            </div>
          </div>
          
          {/* Location/Origin labels - Responsive */}
          <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-8 md:mt-12 text-xs md:text-sm text-forest/60">
            <span>Made in India</span>
            <span className="w-1 h-1 bg-forest/30 rounded-full hidden sm:block" />
            <span>Worldwide Shipping</span>
            <span className="w-1 h-1 bg-forest/30 rounded-full hidden sm:block" />
            <span>Premium Quality</span>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-olive py-4 md:py-6 border-t border-forest/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-corners-lg bg-cream/50 hover:bg-cream hover:-translate-y-1 transition-all duration-300">
                <div className="text-forest text-lg md:text-2xl">{f.icon}</div>
                <div>
                  <p className="text-forest font-semibold text-xs md:text-sm">{f.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-olive rounded-t-corners-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-forest">Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Link key={i} to={`/products?category=${c.name.toLowerCase()}`}
                className="group p-4 md:p-8 bg-cream rounded-corners-lg border-2 border-transparent hover:border-forest/30 hover:-translate-y-2 hover:shadow-float-tinted transition-all duration-300 text-center">
                <span className="text-3xl md:text-5xl mb-2 md:mb-4 block group-hover:scale-110 transition-transform">{c.icon}</span>
                <h3 className="text-forest font-semibold text-sm md:text-lg mb-1 group-hover:text-forest">{c.name}</h3>
                <p className="text-forest/60 text-xs md:text-sm">{c.count}+ Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-forest">Trending</h2>
              <p className="text-forest/60 mt-1 md:mt-2">Most popular this month</p>
            </div>
            <Link to="/products" className="flex items-center gap-2 text-forest hover:text-forest/70 text-sm md:text-base">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="bg-olive rounded-corners-lg overflow-hidden">
                  <div className="aspect-[4/5] skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton skeleton-text w-3/4" />
                    <div className="skeleton skeleton-text w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20 text-forest/60">No products available</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-olive rounded-corners-xl p-8 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-forest/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-moss/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-forest mb-4 md:mb-6">Upgrade Your Tech</h2>
              <p className="text-forest/70 mb-6 md:mb-8">Explore our latest collection today.</p>
              <Link to="/products" className="btn btn-primary">Browse Products <FiArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
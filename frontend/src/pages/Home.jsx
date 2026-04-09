import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../redux/productSlice';
import Loader from '../components/Loader';
import AIRecommendations from '../components/AIRecommendations';
import { MdArrowForward, MdVerified, MdSecurity, MdSupport, MdLocalShipping } from 'react-icons/md';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct({ page: 1 }));
  }, [dispatch]);

  const categories = [
    { name: 'Laptop', image: '💻', count: '150+' },
    { name: 'Mobile', image: '📱', count: '200+' },
    { name: 'Television', image: '📺', count: '80+' },
    { name: 'Camera', image: '📷', count: '60+' },
    { name: 'Headphone', image: '🎧', count: '120+' },
  ];

  const features = [
    {
      icon: <MdVerified className="text-3xl" />,
      title: '100% Authentic',
      description: 'All products are guaranteed genuine'
    },
    {
      icon: <MdSecurity className="text-3xl" />,
      title: 'Secure Payment',
      description: 'Multiple payment options with encryption'
    },
    {
      icon: <MdSupport className="text-3xl" />,
      title: '24/7 Support',
      description: 'Dedicated customer service team'
    },
    {
      icon: <MdLocalShipping className="text-3xl" />,
      title: 'Fast Delivery',
      description: 'Express shipping across India'
    }
  ];

  return (
    <div className="min-h-screen bg-art-black text-art-white">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-art-black via-art-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.15)_0%,_transparent_50%)]" />
        
        <div className="absolute top-20 right-10 w-72 h-72 bg-art-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-art-gold/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-20">
          <div className="max-w-3xl">
            <p className="text-art-gold uppercase tracking-[0.3em] text-sm mb-4 animate-fade-in">
              Welcome to ShopFusion
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-art-white leading-tight mb-6">
              Discover 
              <span className="text-gradient-gold"> Luxury</span>
              <br />Shopping
            </h1>
            <p className="text-art-silver text-xl mb-8 max-w-xl leading-relaxed">
              Experience premium products with exceptional quality. 
              Your destination for the finest selection of electronics and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black font-semibold rounded-lg hover:shadow-lg hover:shadow-art-gold/30 transition-all group"
              >
                Shop Now
                <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-art-gold/30 text-art-gold font-semibold rounded-lg hover:border-art-gold hover:bg-art-gold/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-art-gold/5 to-transparent" />
      </div>

      {/* Features Bar */}
      <div className="bg-art-charcoal border-y border-art-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-art-gold">{feature.icon}</div>
                <div>
                  <p className="text-art-white font-medium text-sm">{feature.title}</p>
                  <p className="text-art-silver text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-art-white mb-4">
              Shop by Category
            </h2>
            <p className="text-art-silver">Explore our wide range of products</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="group p-6 bg-art-charcoal rounded-xl border border-art-gold/10 hover:border-art-gold/30 transition-all text-center hover:-translate-y-1"
              >
                <span className="text-4xl mb-3 block">{cat.image}</span>
                <h3 className="text-art-white font-semibold group-hover:text-art-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="text-art-silver text-sm">{cat.count} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="py-20 px-6 bg-art-charcoal/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-art-white mb-2">
                Trending Now
              </h2>
              <p className="text-art-silver">Most popular products this month</p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-2 text-art-gold hover:text-art-gold-light transition-colors"
            >
              View All <MdArrowForward />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group bg-art-charcoal rounded-xl overflow-hidden border border-art-gold/10 hover:border-art-gold/30 transition-all hover:-translate-y-2"
                >
                  <div className="aspect-square overflow-hidden bg-art-black">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-art-silver">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-art-silver text-sm">{product.category}</p>
                    <h3 className="text-art-white font-semibold mt-1 line-clamp-1 group-hover:text-art-gold transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-art-gold font-bold text-lg">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-art-silver">
              No products available yet
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-art-gold"
            >
              View All Products <MdArrowForward />
            </Link>
          </div>
        </div>
      </div>

      <AIRecommendations />

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-art-gold/20 to-art-gold/5 rounded-2xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-art-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-art-gold/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-art-white mb-4">
                Ready to Start Shopping?
              </h2>
              <p className="text-art-silver mb-8 max-w-xl mx-auto">
                Join thousands of satisfied customers and discover the best products at unbeatable prices.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black font-semibold rounded-lg hover:shadow-lg hover:shadow-art-gold/30 transition-all"
              >
                Browse Products
                <MdArrowForward />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer handled by App component */}
    </div>
  );
};

export default Home;
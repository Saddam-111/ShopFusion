import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdTrendingUp, MdAutoAwesome } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const AIRecommendations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basedOn, setBasedOn] = useState('popular');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SERVER_URL;
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        
        const url = userId 
          ? `${baseUrl}/api/v1/ai/recommendations/${userId}`
          : `${baseUrl}/api/v1/ai/recommendations`;
          
        const res = await axios.get(url, { withCredentials: true });
        setProducts(res.data.products || []);
        setBasedOn(res.data.basedOn || 'popular');
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url
    }));
  };

  if (loading) return null;
  
  if (products.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <MdAutoAwesome className="text-[var(--accent-gold)] text-2xl" />
        <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
          Recommended For You
        </h2>
        <span className="text-sm text-[var(--text-secondary)]">
          ({basedOn === 'user_history' ? 'Based on your browsing history' : 'Popular choices'})
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <div 
            key={product._id}
            className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]/50 transition-all cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="relative">
              <img
                src={product.images?.[0]?.url || '/placeholder.png'}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              {product.rating >= 4 && (
                <div className="absolute top-2 right-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <MdTrendingUp /> Top Rated
                </div>
              )}
            </div>
            <div className="mt-3">
              <h3 className="font-medium text-[var(--text-primary)] text-sm line-clamp-1">{product.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] capitalize">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-green-400 font-bold">₹{product.price?.toLocaleString()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="bg-[var(--accent-gold)] text-[var(--bg-primary)] text-xs px-3 py-1 rounded hover:bg-[var(--accent-gold)]/80"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
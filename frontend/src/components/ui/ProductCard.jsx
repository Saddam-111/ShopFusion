import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';

export const ProductCard = ({ product, size = 'md' }) => {
  const dispatch = useDispatch();
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };
  
  if (!product) return null;
  
  return (
    <Link 
      to={`/product/${product._id}`}
      className="group block"
    >
      <div className="bg-white rounded-corners-lg overflow-hidden transition-all duration-300 hover:shadow-float-tinted">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-olive">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest/40">
              No Image
            </div>
          )}
          
          {/* Blur Reveal Overlay */}
          <div className="product-card-overlay">
            <button
              onClick={handleAddToCart}
              className="product-card-btn px-6 py-3 bg-white text-forest font-bold text-utility text-xs rounded-corners-lg"
            >
              <FiShoppingCart className="inline-block mr-2" size={16} />
              Add to Cart
            </button>
          </div>
          
          {/* Badges */}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-red-500/90 text-white text-xs font-bold rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-forest/60 text-xs uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className={`font-semibold text-forest line-clamp-2 group-hover:text-forest transition-colors ${sizes[size]}`}>
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-forest font-bold text-lg">
                ₹{product.price?.toLocaleString()}
              </span>
            </div>
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 flex items-center justify-center bg-forest/10 text-forest text-xs font-bold rounded-full">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
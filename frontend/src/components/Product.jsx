import React from "react";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ product, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/product/${product._id}`} 
        className="flex gap-4 bg-art-charcoal rounded-xl p-4 border border-art-gold/20 hover:border-art-gold/50 transition-all"
      >
        <div className="w-32 h-32 bg-art-black rounded-lg overflow-hidden flex-shrink-0">
          {product?.images?.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-art-silver text-sm">
              No Image
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-art-gold text-sm capitalize">{product.category}</p>
            <h3 className="text-lg font-semibold text-art-white mt-1">{product.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Rating value={product.rating || 0} disabled={true} />
              <span className="text-art-silver text-sm">({product.numOfReviews || 0})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-art-gold">₹{product.price?.toLocaleString()}</span>
            <span className={`text-xs px-2 py-1 rounded ${
              product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/product/${product._id}`} 
      className="group bg-art-charcoal rounded-xl overflow-hidden border border-art-gold/20 hover:border-art-gold/50 transition-all hover:-translate-y-1"
    >
      <div className="aspect-square bg-art-black overflow-hidden relative">
        {product?.images?.length > 0 ? (
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
        
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded ${
            product.stock > 0 ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
          }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-art-gold text-sm capitalize">{product.category}</p>
        <h3 className="text-art-white font-semibold mt-1 line-clamp-1 group-hover:text-art-gold transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-2">
          <Rating value={product.rating || 0} disabled={true} />
          <span className="text-art-silver text-sm">({product.numOfReviews || 0})</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-art-gold">₹{product.price?.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default Product;
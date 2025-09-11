import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import Rating from "./Rating";
import { MdDetails } from "react-icons/md";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  const [rating, setRating] = useState(0)
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log(`rating changed to : ${newRating}`)
  }
  return (
    <Link to={`/product/${product._id}`} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition shadow-xl shadow-[#3c433b]">
      {/* Product Image */}
      <div className="w-full h-48 bg-[#a9c5a0] flex items-center justify-center">
        {product?.images?.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[#1f241f] font-semibold">No Image</span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-[#1f241f] truncate">
          {product.name}
        </h3>
        <div className="flex flex-row w-full justify-between">
          <p className="text-[#647a67] font-medium">₹ {product.price}</p>
          <div>
            <Rating value={product.rating}
                    onRatingChange = {handleRatingChange}
                    disabled = {true}
             />
          </div>
          <span>({product.numOfReviews} Reviews)</span>
        </div>

        {/* Add to Cart */}
        <button className="mt-3 flex items-center justify-center gap-2 bg-[#1f241f] text-white py-2 px-4 rounded-lg hover:bg-[#647a67] transition">
          <MdDetails />
          View Details
        </button>
      </div>
    </Link>
  );
};

export default Product;

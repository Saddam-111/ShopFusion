import React, { useEffect, useState } from "react";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../redux/productSlice";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { product, error, loading } = useSelector((state) => state.product);
  const { id } = useParams();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  const increaseQty = () => {
    if (qty < product.stock) setQty(qty + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Product Layout */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side (Image) */}
        <div className="md:w-3/5 w-full bg-[#a9c5a0] rounded-lg flex items-center justify-center p-2">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-[400px] object-contain"
            />
          ) : (
            <span className="text-[#1f241f] font-semibold">No Image</span>
          )}
        </div>

        {/* Right Side (Details) */}
        <div className="md:w-2/5 w-full flex flex-col space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1f241f]">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-xl font-semibold text-[#647a67]">₹ {product.price}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <Rating value={product.rating} disabled={true} />
            <span className="text-sm text-gray-600">
              ({product.numOfReviews}{" "}
              {product.numOfReviews === 1 ? "Review" : "Reviews"})
            </span>
          </div>

          {/* Stock */}
          <div className="text-sm font-medium">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}{" "}
            ({product.stock} available)
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center border border-gray-400 rounded-md overflow-hidden">
              <button
                onClick={decreaseQty}
                className="px-3 py-1 bg-[#8fa38a] text-white hover:bg-[#647a67] transition"
              >
                -
              </button>
              <input
                type="text"
                readOnly
                value={qty}
                className="w-12 text-center border-l border-r border-gray-300 bg-white text-[#1f241f]"
              />
              <button
                onClick={increaseQty}
                className="px-3 py-1 bg-[#8fa38a] text-white hover:bg-[#647a67] transition"
              >
                +
              </button>
            </div>

            <button className="bg-[#1f241f] text-white px-6 py-2 rounded-md hover:bg-[#647a67] transition">
              Add to Cart
            </button>
          </div>

          {/* Review Form */}
          <form className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#1f241f]">Write a Review</h3>
            <Rating value={0} disabled={false} />
            <textarea
              placeholder="Write your review here..."
              className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8fa38a]"
            ></textarea>
            <button
              type="submit"
              className="bg-[#8fa38a] text-white px-5 py-2 rounded-md hover:bg-[#647a67] transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-[#1f241f] mb-4">Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-[#f9faf9]"
              >
                <Rating value={review.rating} disabled={true} />
                <p className="text-gray-700 mt-1">{review.comment}</p>
                <p className="text-sm text-gray-500">by: {review.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ProductDetails;

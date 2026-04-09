import React, { useEffect, useState, useRef } from "react";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, getProduct } from "../redux/productSlice";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);
  const { products } = useSelector((state) => state.product);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  
  // Zoom state
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.category) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchRelatedProducts = async () => {
    setLoadingRelated(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/v1/products?category=${encodeURIComponent(product.category)}`,
        { withCredentials: true }
      );
      
      // Related products: same category, excluding current product
      const related = (data.products || []).filter(p => p._id !== id).slice(0, 4);
      setRelatedProducts(related);
      
      // Recommended: products from other categories or best rated
      const recommended = (data.products || [])
        .filter(p => p._id !== id)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
      setRecommendedProducts(recommended);
    } catch (err) {
      console.error("Failed to fetch related products:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const increaseQty = () => {
    if (qty < product.stock) setQty(qty + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: qty }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/v1/product/review`,
        { rating, comment, productId: id },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Review submitted successfully!");
        dispatch(getProductDetails(id));
        setRating(0);
        setComment("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)] transition-all hover:-translate-y-1">
        <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-[var(--bg-primary)]">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
              No Image
            </div>
          )}
        </div>
        <h4 className="text-[var(--text-primary)] font-medium text-sm line-clamp-2 group-hover:text-[var(--accent-gold)] transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[var(--accent-gold)] font-bold">₹{product.price?.toLocaleString()}</span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs bg-[var(--accent-gold)] text-[var(--bg-primary)] px-1.5 py-0.5 rounded">
                {product.rating.toFixed(1)} ★
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)] animate-spin rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/products" className="text-[var(--accent-gold)] hover:underline">Go back to products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] text-xl mb-4">Product not found</p>
          <Link to="/products" className="text-[var(--accent-gold)] hover:underline">Go back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/products" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] mb-8 transition-colors">
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--accent-gold)]/20">
            {/* Main Image with Zoom */}
            <div 
              ref={imageContainerRef}
              className="relative w-full h-[400px] overflow-hidden rounded-lg cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[activeImage]?.url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Zoom Overlay */}
                  {isZoomed && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `url(${product.images[activeImage]?.url})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx 
                        ? 'border-[var(--accent-gold)]' 
                        : 'border-[var(--accent-gold)]/20 hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-[var(--accent-gold)] text-sm capitalize">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--text-primary)]">{product.name}</h1>
            <p className="text-[var(--text-secondary)]">{product.description}</p>
            
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[var(--accent-gold)]">₹ {product.price?.toLocaleString()}</span>
              {product.numOfReviews > 0 && (
                <div className="flex items-center gap-2">
                  <Rating value={product.rating || 0} disabled={true} />
                  <span className="text-[var(--text-secondary)] text-sm">({product.numOfReviews} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center border border-[var(--accent-gold)]/30 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQty}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-gold)]/20 transition"
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={qty}
                    className="w-12 text-center border-l border-r border-[var(--accent-gold)]/30 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                  <button
                    onClick={increaseQty}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-gold)]/20 transition"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-gold)] to-[#b8960c] text-[var(--bg-primary)] font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--accent-gold)]/30 transition-all"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-6">Customer Reviews</h3>
          
          {/* Review Form - Only show if user is logged in */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--accent-gold)]/20 mb-8">
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Write a Review</h4>
              <div className="mb-4">
                <label className="block text-[var(--text-secondary)] text-sm mb-2">Rating</label>
                <Rating value={rating} onRatingChange={setRating} disabled={submitting} />
              </div>
              <div className="mb-4">
                <label className="block text-[var(--text-secondary)] text-sm mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  rows={4}
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
          
          {!isAuthenticated && product.reviews?.length > 0 && (
            <p className="text-[var(--text-secondary)] mb-4">Login to write a review</p>
          )}
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--accent-gold)]/20"
                >
                  <Rating value={review.rating} disabled={true} className="mb-2" />
                  <p className="text-[var(--text-secondary)] mt-3">{review.comment}</p>
                  <p className="text-[var(--accent-gold)] text-sm mt-2">- {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)]">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-6">
              Related Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-6">
              Recommended For You
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
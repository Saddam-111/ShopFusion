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
      
      const related = (data.products || []).filter(p => p._id !== id).slice(0, 4);
      setRelatedProducts(related);
      
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
      <div className="bg-white rounded-corners-lg p-4 border border-forest/10 hover:border-forest/30 transition-all hover:-translate-y-1">
        <div className="aspect-square mb-3 overflow-hidden rounded-corners-lg bg-olive">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest/40">
              No Image
            </div>
          )}
        </div>
        <h4 className="text-forest font-medium text-sm line-clamp-2 group-hover:text-forest transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-forest font-bold">₹{product.price?.toLocaleString()}</span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs bg-forest/10 text-forest px-1.5 py-0.5 rounded">
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
      <div className="min-h-screen bg-cream text-forest pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-forest/30 border-t-forest animate-spin rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream text-forest pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/products" className="text-forest hover:underline">Go back to products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream text-forest pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-forest/60 text-xl mb-4">Product not found</p>
          <Link to="/products" className="text-forest hover:underline">Go back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/products" className="inline-flex items-center gap-2 text-forest/60 hover:text-forest mb-8 transition-colors">
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-corners-lg p-4 border border-forest/10">
            <div 
              ref={imageContainerRef}
              className="relative w-full h-[400px] overflow-hidden rounded-corners-lg cursor-crosshair"
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
                <div className="w-full h-full flex items-center justify-center text-forest/40">
                  No Image Available
                </div>
              )}
          </div>
          
          {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-corners-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx 
                        ? 'border-forest' 
                        : 'border-forest/20 hover:border-forest/40'
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
            <p className="text-forest/60 text-sm capitalize text-utility">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-display text-forest">{product.name}</h1>
            <p className="text-forest/70">{product.description}</p>
            
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-forest">₹ {product.price?.toLocaleString()}</span>
              {product.numOfReviews > 0 && (
                <div className="flex items-center gap-2">
                  <Rating value={product.rating || 0} disabled={true} />
                  <span className="text-forest/60 text-sm">({product.numOfReviews} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="text-green-600 flex items-center gap-1">
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
                <div className="flex items-center border-2 border-forest/20 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQty}
                    className="px-4 py-2 bg-olive text-forest hover:bg-forest/10 transition"
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={qty}
                    className="w-12 text-center border-l border-r border-forest/20 bg-cream text-forest"
                  />
                  <button
                    onClick={increaseQty}
                    className="px-4 py-2 bg-olive text-forest hover:bg-forest/10 transition"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold rounded-corners-lg hover:shadow-float transition-all"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-display text-forest mb-6">Customer Reviews</h3>
          
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="bg-white rounded-corners-lg p-6 border border-forest/10 mb-8">
              <h4 className="text-lg font-semibold text-forest mb-4">Write a Review</h4>
              <div className="mb-4">
                <label className="block text-forest/60 text-sm mb-2">Rating</label>
                <Rating value={rating} onRatingChange={setRating} disabled={submitting} />
              </div>
              <div className="mb-4">
                <label className="block text-forest/60 text-sm mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
                  rows={4}
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-forest text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
          
          {!isAuthenticated && product.reviews?.length > 0 && (
            <p className="text-forest/60 mb-4">Login to write a review</p>
          )}
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white rounded-corners-lg p-6 border border-forest/10"
                >
                  <Rating value={review.rating} disabled={true} className="mb-2" />
                  <p className="text-forest/70 mt-3">{review.comment}</p>
                  <p className="text-forest text-sm mt-2">- {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-forest/60">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-display text-forest mb-6">
              Related Products
            </h3>
            <div className="feature-grid">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-display text-forest mb-6">
              Recommended For You
            </h3>
            <div className="feature-grid">
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
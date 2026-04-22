import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiX } from "react-icons/fi";
import { getCart, updateCartQuantity, removeFromCart } from "../redux/cartSlice";
import { applyCoupon, removeCoupon, clearCouponState } from "../redux/couponSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  
  const { products, totalPrice, totalItems, loading, cart } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { appliedCoupon, discount, finalTotal, shippingDiscount, message, error, loading: couponLoading } = useSelector((state) => state.coupon);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (cart?.coupon) {
      setCouponCode(cart.coupon.code || "");
    }
  }, [cart]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <FiShoppingBag size={64} className="text-forest mb-4" />
            <h2 className="text-2xl font-display text-forest mb-4">Please Login</h2>
            <p className="text-forest/60 mb-8">Login to view your cart</p>
            <Link to="/login">
              <button className="px-8 py-3 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-forest/30 border-t-forest animate-spin rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <FiShoppingBag size={64} className="text-forest mb-4" />
            <h2 className="text-2xl font-display text-forest mb-4">Your Cart is Empty</h2>
            <p className="text-forest/60 mb-8">Add some items to your cart</p>
            <Link to="/products">
              <button className="px-8 py-3 border-2 border-forest text-forest font-semibold rounded-corners-lg hover:bg-forest hover:text-cream transition-all">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await dispatch(applyCoupon(couponCode.trim().toUpperCase()));
    dispatch(getCart());
  };

  const handleRemoveCoupon = async () => {
    await dispatch(removeCoupon());
    dispatch(getCart());
    setCouponCode("");
    dispatch(clearCouponState());
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const displayTotal = appliedCoupon && finalTotal > 0 ? finalTotal : totalPrice;
  const showDiscount = appliedCoupon && discount > 0;

  return (
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-display text-forest mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {products.map((item) => (
              <div key={item.product} className="flex gap-4 bg-white rounded-corners-lg p-4 border border-forest/10">
                <div className="w-24 h-24 bg-olive rounded-corners-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-forest/40 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-forest">{item.name}</h3>
                  <p className="text-forest font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-forest/20 text-forest hover:bg-forest/10 rounded-lg"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-forest/20 text-forest hover:bg-forest/10 rounded-lg"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.product)}
                      className="text-forest/50 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-corners-lg p-6 border border-forest/10 sticky top-24">
              <h3 className="text-xl font-display text-forest mb-4">Order Summary</h3>
              
              {!appliedCoupon && (
                <form onSubmit={handleApplyCoupon} className="mb-4">
                  <label className="text-sm text-forest/60 mb-2 block">Have a coupon?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-forest/20 text-forest rounded-lg focus:outline-none focus:border-forest"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-forest text-cream font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  {message && !error && <p className="text-green-600 text-sm mt-2">{message}</p>}
                </form>
              )}

              {appliedCoupon && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-semibold">{appliedCoupon.code}</p>
                      <p className="text-green-600/70 text-sm">
                        {appliedCoupon.discountType === "percentage" 
                          ? `${appliedCoupon.discountValue}% OFF`
                          : appliedCoupon.discountType === "flat"
                          ? `₹${appliedCoupon.discountValue} OFF`
                          : "Free Shipping"}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      className="p-2 text-forest/50 hover:text-red-500 transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-forest/70">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                
                {showDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="border-t border-forest/20 pt-3 flex justify-between text-lg font-semibold text-forest">
                  <span>Total</span>
                  <span className="text-forest">₹{displayTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                className="w-full mt-6 px-8 py-3 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
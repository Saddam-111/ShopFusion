import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { getCart, updateCartQuantity, removeFromCart } from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, totalPrice, totalItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <FiShoppingBag size={64} className="text-art-gold mb-4" />
            <h2 className="text-2xl font-serif font-bold text-art-white mb-4">Please Login</h2>
            <p className="text-art-silver mb-8">Login to view your cart</p>
            <Link to="/login">
              <button className="px-8 py-3 bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black font-semibold rounded-lg hover:shadow-lg hover:shadow-art-gold/30 transition-all">
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
      <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-art-gold/30 border-t-art-gold animate-spin rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <FiShoppingBag size={64} className="text-art-gold mb-4" />
            <h2 className="text-2xl font-serif font-bold text-art-white mb-4">Your Cart is Empty</h2>
            <p className="text-art-silver mb-8">Add some luxury items to your cart</p>
            <Link to="/products">
              <button className="px-8 py-3 border-2 border-art-gold text-art-gold font-semibold rounded-lg hover:bg-art-gold hover:text-art-black transition-all">
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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-serif font-bold text-art-white mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {products.map((item) => (
              <div key={item.product} className="flex gap-4 bg-art-charcoal rounded-xl p-4 border border-art-gold/20">
                <div className="w-24 h-24 bg-art-black rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-art-silver text-sm">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-art-white">{item.name}</h3>
                  <p className="text-art-gold font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-art-gold/30 text-art-gold hover:bg-art-gold/10 rounded"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-art-gold/30 text-art-gold hover:bg-art-gold/10 rounded"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.product)}
                      className="text-art-silver hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20 sticky top-24">
              <h3 className="text-xl font-serif font-bold text-art-white mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-art-silver">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-art-gold/20 pt-3 flex justify-between text-lg font-semibold text-art-white">
                  <span>Total</span>
                  <span className="text-art-gold">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                className="w-full mt-6 px-8 py-3 bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black font-semibold rounded-lg hover:shadow-lg hover:shadow-art-gold/30 transition-all"
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
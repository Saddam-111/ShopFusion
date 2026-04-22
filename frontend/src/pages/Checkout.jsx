import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createPaymentOrder, verifyPayment, resetPayment, createCODOrder } from "../redux/paymentSlice";
import { getCart } from "../redux/cartSlice";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
    } else {
      resolve(null);
    }
  });
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { products, totalPrice } = useSelector((state) => state.cart);
  const { orderId, loading, success, error } = useSelector((state) => state.payment);

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phoneNo: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (success) {
      toast.success("Order placed successfully!");
      navigate("/profile");
      dispatch(resetPayment());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate, dispatch]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleRazorpayPayment = async () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode || !shippingInfo.phoneNo) {
      toast.error("Please fill all shipping details");
      return;
    }

    try {
      const result = await dispatch(createPaymentOrder(totalPrice));

      if (createPaymentOrder.rejected.match(result)) {
        toast.error(result.payload || "Failed to create payment order");
        return;
      }

      const razorpayOrderId = result.payload.orderId;
      const Razorpay = await loadRazorpay();

      if (!Razorpay) {
        toast.error("Failed to load payment system. Please try again.");
        return;
      }

      const rzp = new Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: razorpayOrderId,
        amount: totalPrice * 100,
        currency: "INR",
        name: "ShopFusion",
        description: "Order Payment",
        handler: async (response) => {
          const verifyResult = await dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cart: products,
            shippingInfo
          }));

          if (verifyPayment.rejected.match(verifyResult)) {
            toast.error(verifyResult.payload || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: shippingInfo.phoneNo || ""
        },
        theme: {
          color: "#01472e"
        }
      });

      rzp.on('payment.failed', (response) => {
        toast.error(response.error?.description || response.error?.reason || "Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      toast.error("Payment error: " + err.message);
    }
  };

  const handleCODPayment = async () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode || !shippingInfo.phoneNo) {
      toast.error("Please fill all shipping details");
      return;
    }

    const result = await dispatch(createCODOrder(shippingInfo));

    if (createCODOrder.rejected.match(result)) {
      toast.error(result.payload || "Failed to place COD order");
      return;
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <h2 className="text-2xl font-display text-forest mb-4">Your cart is empty</h2>
            <Link to="/products" className="text-forest hover:underline">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-display text-forest mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
            <h3 className="text-xl font-display text-forest mb-6">Shipping Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-forest/60 text-sm mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-forest/60 text-sm mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-forest/60 text-sm mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-forest/60 text-sm mb-2">Pincode *</label>
                  <input
                    type="number"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-forest/60 text-sm mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={shippingInfo.phoneNo}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
            <h3 className="text-xl font-display text-forest mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6">
              {products.map((item) => (
                <div key={item.product} className="flex justify-between text-forest/70">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-forest/20 pt-4 flex justify-between text-xl font-semibold text-forest">
              <span>Total</span>
              <span className="text-forest">₹{totalPrice.toLocaleString()}</span>
            </div>

            <div className="mt-6">
              <h4 className="text-forest font-semibold mb-3">Payment Method</h4>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-corners-lg cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-forest bg-forest/5' : 'border-forest/20 hover:border-forest/40'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="text-forest font-medium">Pay Online (Razorpay)</span>
                    <p className="text-forest/60 text-sm">Pay securely via Razorpay</p>
                  </div>
                </label>
                <label className={`flex items-center p-4 border rounded-corners-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-forest bg-forest/5' : 'border-forest/20 hover:border-forest/40'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="text-forest font-medium">Cash on Delivery</span>
                    <p className="text-forest/60 text-sm">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center mt-6">
                <div className="w-10 h-10 border-4 border-forest/30 border-t-forest animate-spin rounded-full" />
              </div>
            ) : (
              <button
                className="w-full mt-6 px-8 py-3 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all"
                onClick={handlePlaceOrder}
              >
                {paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place Order (Cash on Delivery)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
import Razorpay from "razorpay";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    let userCart = await Cart.findOne({ user: req.user._id });
    
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
      await userCart.save();
    }
    
    if (!userCart.products || userCart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add items to cart first."
      });
    }

    const cartTotal = userCart.totalPrice || 0;

    if (Math.abs(cartTotal - amount) > 1) {
      return res.status(400).json({
        success: false,
        message: `Amount mismatch. Cart total is ₹${cartTotal}, but you sent ₹${amount}`
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`
    };
    
    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpError) {
      console.error('Razorpay Error:', rzpError.error);
      return res.status(500).json({
        success: false,
        message: rzpError.error?.description || "Payment processing error"
      });
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Payment order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment processing error"
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingInfo
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    let userCart = await Cart.findOne({ user: req.user._id });
    
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
    }
    
    if (!userCart.products || userCart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Please add items to cart first."
      });
    }

    const safeShippingInfo = {
      address: String(shippingInfo.address || "").substring(0, 200),
      city: String(shippingInfo.city || "").substring(0, 50),
      state: String(shippingInfo.state || "").substring(0, 50),
      country: String(shippingInfo.country || "India").substring(0, 50),
      pincode: Number(shippingInfo.pincode) || 0,
      phoneNo: Number(shippingInfo.phoneNo) || 0
    };

    if (!safeShippingInfo.address || !safeShippingInfo.city || !safeShippingInfo.pincode) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping information"
      });
    }

    const orderItems = userCart.products.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      product: item.product
    }));

    const order = await Order.create({
      shippingInfo: safeShippingInfo,
      orderItems,
      user: req.user._id,
      paymentInfo: {
        id: razorpay_payment_id,
        status: "PAID"
      },
      paidAt: new Date(),
      itemPrice: userCart.totalPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: userCart.totalPrice,
      orderStatus: "Processing"
    });
    
    await Cart.findOneAndDelete({ user: req.user._id });
    
    const newCart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
    await newCart.save();

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed",
      order
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Order processing error"
    });
  }
};

export const createCODOrder = async (req, res) => {
  try {
    const { shippingInfo } = req.body;

    let userCart = await Cart.findOne({ user: req.user._id });
    
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
      await userCart.save();
    }
    
    if (!userCart.products || userCart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add items to cart first."
      });
    }

    const safeShippingInfo = {
      address: String(shippingInfo.address || "").substring(0, 200),
      city: String(shippingInfo.city || "").substring(0, 50),
      state: String(shippingInfo.state || "").substring(0, 50),
      country: String(shippingInfo.country || "India").substring(0, 50),
      pincode: Number(shippingInfo.pincode) || 0,
      phoneNo: Number(shippingInfo.phoneNo) || 0
    };

    if (!safeShippingInfo.address || !safeShippingInfo.city || !safeShippingInfo.pincode) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping information"
      });
    }

    const orderItems = userCart.products.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      product: item.product
    }));

    const order = await Order.create({
      shippingInfo: safeShippingInfo,
      orderItems,
      user: req.user._id,
      paymentInfo: {
        id: `COD_${Date.now()}`,
        status: "PENDING"
      },
      paymentMethod: "COD",
      paidAt: null,
      itemPrice: userCart.totalPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: userCart.totalPrice,
      orderStatus: "Processing"
    });
    
    await Cart.findOneAndDelete({ user: req.user._id });
    
    const newCart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
    await newCart.save();

    res.status(201).json({
      success: true,
      message: "Order placed with Cash on Delivery",
      order
    });
  } catch (error) {
    console.error('COD order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Order processing error"
    });
  }
};
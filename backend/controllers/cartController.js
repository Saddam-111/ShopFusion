import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
      await cart.save();
    }
    
    cart.calculateTotal();
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }
    
    const existingItemIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      const newQuantity = cart.products[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock for required quantity"
        });
      }
      
      cart.products[existingItemIndex].quantity = newQuantity;
    } else {
      cart.products.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || "",
        quantity,
        stock: product.stock
      });
    }
    
    cart.calculateTotal();
    
    if (cart.coupon && cart.coupon.code) {
      const { Coupon } = await import("../models/couponModel.js");
      const coupon = await Coupon.findOne({ code: cart.coupon.code });
      
      if (coupon && cart.totalPrice >= coupon.minCartValue) {
        let eligibleAmount = cart.totalPrice;
        
        if (coupon.applicableCategories.length > 0 || coupon.applicableProducts.length > 0) {
          let categoryDiscount = 0;
          let productDiscount = 0;
          
          for (const item of cart.products) {
            const prod = await Product.findById(item.product);
            if (prod) {
              const itemTotal = item.price * item.quantity;
              if (coupon.applicableCategories.includes(prod.category)) {
                categoryDiscount += itemTotal;
              }
              if (coupon.applicableProducts.some(p => p.toString() === item.product.toString())) {
                productDiscount += itemTotal;
              }
            }
          }
          eligibleAmount = Math.max(categoryDiscount, productDiscount);
        }
        
        let discount = 0;
        if (coupon.discountType === "percentage") {
          discount = (eligibleAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === "flat") {
          discount = coupon.discountValue;
          if (discount > eligibleAmount) {
            discount = eligibleAmount;
          }
        }
        
        const finalTotal = cart.totalPrice - discount;
        cart.coupon.discount = discount;
        cart.coupon.finalTotal = finalTotal < 0 ? 0 : finalTotal;
      }
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: "Added to cart",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }
    
    const itemIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart"
      });
    }
    
    const product = await Product.findById(productId);
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }
    
    if (quantity <= 0) {
      cart.products.splice(itemIndex, 1);
    } else {
      cart.products[itemIndex].quantity = quantity;
    }
    
    if (cart.coupon) {
      const { Coupon } = await import("../models/couponModel.js");
      const coupon = await Coupon.findOne({ code: cart.coupon.code });
      
      if (coupon) {
        let eligibleAmount = cart.totalPrice;
        if (coupon.applicableCategories.length > 0 || coupon.applicableProducts.length > 0) {
          let categoryDiscount = 0;
          let productDiscount = 0;
          
          for (const item of cart.products) {
            const prod = await Product.findById(item.product);
            if (prod) {
              const itemTotal = item.price * item.quantity;
              if (coupon.applicableCategories.includes(prod.category)) {
                categoryDiscount += itemTotal;
              }
              if (coupon.applicableProducts.some(p => p.toString() === item.product.toString())) {
                productDiscount += itemTotal;
              }
            }
          }
          eligibleAmount = Math.max(categoryDiscount, productDiscount);
        }
        
        let discount = 0;
        if (coupon.discountType === "percentage") {
          discount = (eligibleAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === "flat") {
          discount = coupon.discountValue;
          if (discount > eligibleAmount) {
            discount = eligibleAmount;
          }
        }
        
        const finalTotal = cart.totalPrice - discount;
        cart.coupon.discount = discount;
        cart.coupon.finalTotal = finalTotal < 0 ? 0 : finalTotal;
      }
    }
    
    cart.calculateTotal();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }
    
    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );
    
    if (cart.coupon) {
      const { Coupon } = await import("../models/couponModel.js");
      const coupon = await Coupon.findOne({ code: cart.coupon.code });
      
      if (coupon) {
        let eligibleAmount = cart.totalPrice;
        if (coupon.applicableCategories.length > 0 || coupon.applicableProducts.length > 0) {
          let categoryDiscount = 0;
          let productDiscount = 0;
          
          for (const item of cart.products) {
            const prod = await Product.findById(item.product);
            if (prod) {
              const itemTotal = item.price * item.quantity;
              if (coupon.applicableCategories.includes(prod.category)) {
                categoryDiscount += itemTotal;
              }
              if (coupon.applicableProducts.some(p => p.toString() === item.product.toString())) {
                productDiscount += itemTotal;
              }
            }
          }
          eligibleAmount = Math.max(categoryDiscount, productDiscount);
        }
        
        let discount = 0;
        if (coupon.discountType === "percentage") {
          discount = (eligibleAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === "flat") {
          discount = coupon.discountValue;
          if (discount > eligibleAmount) {
            discount = eligibleAmount;
          }
        }
        
        const finalTotal = cart.totalPrice - discount;
        cart.coupon.discount = discount;
        cart.coupon.finalTotal = finalTotal < 0 ? 0 : finalTotal;
      }
    }
    
    cart.calculateTotal();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: "Removed from cart",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    
    const newCart = new Cart({ user: req.user._id, products: [], totalPrice: 0, totalItems: 0 });
    await newCart.save();
    
    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: newCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
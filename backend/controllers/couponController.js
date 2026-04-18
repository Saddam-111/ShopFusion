import { Coupon } from "../models/couponModel.js";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minCartValue = 0,
      maxDiscount = null,
      expiryDate,
      usageLimit = null,
      userUsageLimit = 1,
      applicableUsers = [],
      applicableCategories = [],
      applicableProducts = [],
      allowMultiple = false
    } = req.body;

    if (!code || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists"
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%"
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minCartValue,
      maxDiscount,
      expiryDate,
      usageLimit,
      userUsageLimit,
      applicableUsers,
      applicableCategories,
      applicableProducts,
      allowMultiple
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    res.status(200).json({
      success: true,
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minCartValue,
      maxDiscount,
      expiryDate,
      usageLimit,
      userUsageLimit,
      applicableUsers,
      applicableCategories,
      applicableProducts,
      isActive,
      allowMultiple
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists"
        });
      }
      coupon.code = code.toUpperCase();
    }

    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minCartValue !== undefined) coupon.minCartValue = minCartValue;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (userUsageLimit) coupon.userUsageLimit = userUsageLimit;
    if (applicableUsers) coupon.applicableUsers = applicableUsers;
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (allowMultiple !== undefined) coupon.allowMultiple = allowMultiple;

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required"
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code"
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active"
      });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired"
      });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon has reached its usage limit"
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty"
      });
    }

    if (cart.coupon && cart.coupon.code) {
      if (cart.coupon.code === code.toUpperCase().trim()) {
        return res.status(400).json({
          success: false,
          message: "This coupon is already applied"
        });
      }
      if (!cart.coupon.allowMultiple) {
        return res.status(400).json({
          success: false,
          message: "A coupon is already applied. Remove it first to apply a new one"
        });
      }
    }

    if (cart.totalPrice < coupon.minCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart value of ₹${coupon.minCartValue} required for this coupon`
      });
    }

    if (coupon.applicableUsers && coupon.applicableUsers.length > 0) {
      const isUserEligible = coupon.applicableUsers.some(
        userId => userId.toString() === req.user._id.toString()
      );
      if (!isUserEligible) {
        return res.status(400).json({
          success: false,
          message: "You are not eligible to use this coupon"
        });
      }
    }

    let eligibleAmount = cart.totalPrice;

    if (coupon.applicableCategories.length > 0 || coupon.applicableProducts.length > 0) {
      let categoryDiscount = 0;
      let productDiscount = 0;

      for (const item of cart.products) {
        const product = await Product.findById(item.product);
        
        if (product) {
          const itemTotal = item.price * item.quantity;
          
          if (coupon.applicableCategories.includes(product.category)) {
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
    let shippingDiscount = false;

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
    } else if (coupon.discountType === "free_shipping") {
      shippingDiscount = true;
    }

    const userUsage = coupon.usedByUsers.find(
      u => u.user.toString() === req.user._id.toString()
    );

    if (userUsage) {
      if (userUsage.usageCount >= coupon.userUsageLimit) {
        return res.status(400).json({
          success: false,
          message: `You have already used this coupon ${coupon.userUsageLimit} time(s)`
        });
      }
    }

    const finalTotal = cart.totalPrice - discount;

    cart.coupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: discount,
      finalTotal: finalTotal < 0 ? 0 : finalTotal,
      shippingDiscount,
      allowMultiple: coupon.allowMultiple
    };

    const existingUserUsage = coupon.usedByUsers.find(
      u => u.user.toString() === req.user._id.toString()
    );

    if (existingUserUsage) {
      existingUserUsage.usageCount += 1;
      existingUserUsage.usedAt.push(new Date());
    } else {
      coupon.usedByUsers.push({
        user: req.user._id,
        usageCount: 1,
        usedAt: [new Date()]
      });
    }

    coupon.usedCount += 1;
    await coupon.save();

    cart.calculateTotal();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        finalTotal: finalTotal < 0 ? 0 : finalTotal,
        shippingDiscount
      },
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeCoupon = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    if (!cart.coupon) {
      return res.status(400).json({
        success: false,
        message: "No coupon applied"
      });
    }

    const couponCode = cart.coupon.code;
    const coupon = await Coupon.findOne({ code: couponCode });

    if (coupon) {
      const userUsage = coupon.usedByUsers.find(
        u => u.user.toString() === req.user._id.toString()
      );
      
      if (userUsage && userUsage.usageCount > 0) {
        userUsage.usageCount -= 1;
        if (userUsage.usedAt && userUsage.usedAt.length > 0) {
          userUsage.usedAt.pop();
        }
        await coupon.save();
      }
    }

    cart.coupon = undefined;
    cart.calculateTotal();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required"
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code"
      });
    }

    const response = {
      success: true,
      valid: coupon.isActive && new Date() <= coupon.expiryDate,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minCartValue: coupon.minCartValue,
      message: ""
    };

    if (!coupon.isActive) {
      response.valid = false;
      response.message = "This coupon is no longer active";
    } else if (new Date() > coupon.expiryDate) {
      response.valid = false;
      response.message = "This coupon has expired";
    } else if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      response.valid = false;
      response.message = "This coupon has reached its usage limit";
    } else {
      response.message = "Coupon is valid";
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
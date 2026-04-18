import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon code is required"],
    uppercase: true,
    trim: true,
    unique: true
  },
  discountType: {
    type: String,
    required: true,
    enum: {
      values: ["percentage", "flat", "free_shipping"],
      message: "Discount type must be either percentage, flat, or free_shipping"
    }
  },
  discountValue: {
    type: Number,
    required: [true, "Discount value is required"],
    min: [0, "Discount value cannot be negative"]
  },
  minCartValue: {
    type: Number,
    default: 0,
    min: [0, "Minimum cart value cannot be negative"]
  },
  maxDiscount: {
    type: Number,
    default: null,
    min: [0, "Maximum discount cannot be negative"]
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date is required"]
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [0, "Usage limit cannot be negative"]
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1,
    min: [1, "User usage limit must be at least 1"]
  },
  usedByUsers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    usageCount: {
      type: Number,
      default: 0
    },
    usedAt: [{
      type: Date
    }]
  }],
  applicableUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  applicableCategories: [{
    type: String,
    trim: true
  }],
  applicableProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product"
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  allowMultiple: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ expiryDate: 1 });

export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
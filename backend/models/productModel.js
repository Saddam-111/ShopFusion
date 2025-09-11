import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"]
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  images: [{
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  category: {
    type: String,
    required: [true, "Product category name is required"],
    trim: true

  },
  stock: {
    type: Number,
    required: [true, "Enter product stock"],
    maxLength: [5, "Price cannot exceed 7 digits"],
    default: 1
  },
  numOfReviews: {
    type:Number,
    default: 0
  },
  reviews: [
    { 
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true,
      }
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

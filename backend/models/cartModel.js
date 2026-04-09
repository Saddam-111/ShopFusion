import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      stock: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

cartSchema.methods.calculateTotal = function() {
  this.totalItems = this.products.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
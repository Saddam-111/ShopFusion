import { configureStore } from "@reduxjs/toolkit";
import productSlice from './productSlice.js'
import userSlice from './userSlice.js'
import cartSlice from './cartSlice.js'
import paymentSlice from './paymentSlice.js'

export const store = configureStore({
  reducer: {
    product : productSlice,
    user: userSlice,
    cart: cartSlice,
    payment: paymentSlice
  }
})

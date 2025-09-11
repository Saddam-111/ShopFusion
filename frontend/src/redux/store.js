import { configureStore } from "@reduxjs/toolkit";
import productSlice from './productSlice.js'
import userSlice from './userSlice.js'

export const store = configureStore({
  reducer: {
    product : productSlice,
    user: userSlice
  }
})

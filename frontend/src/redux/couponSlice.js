import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/coupons/apply`,
        { code },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "coupon/remove",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/coupons/remove`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const validateCoupon = createAsyncThunk(
  "coupon/validate",
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/coupons/validate`,
        { code },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    appliedCoupon: null,
    discount: 0,
    finalTotal: 0,
    shippingDiscount: false,
    message: null,
    error: null,
    loading: false,
    validating: false
  },
  reducers: {
    clearCouponState: (state) => {
      state.appliedCoupon = null;
      state.discount = 0;
      state.finalTotal = 0;
      state.shippingDiscount = false;
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.discount = action.payload.coupon.discount;
        state.finalTotal = action.payload.coupon.finalTotal;
        state.shippingDiscount = action.payload.coupon.shippingDiscount;
        state.message = action.payload.message;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.loading = false;
        state.appliedCoupon = null;
        state.discount = 0;
        state.finalTotal = 0;
        state.shippingDiscount = false;
        state.message = "Coupon removed successfully";
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateCoupon.pending, (state) => {
        state.validating = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validating = false;
        state.message = action.payload.message;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.validating = false;
        state.error = action.payload;
      });
  }
});

export const { clearCouponState } = couponSlice.actions;
export default couponSlice.reducer;
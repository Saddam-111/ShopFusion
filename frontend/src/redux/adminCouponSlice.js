import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const getAllCoupons = createAsyncThunk(
  "adminCoupon/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/coupons`, { withCredentials: true });
      return data.coupons;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "adminCoupon/create",
  async (couponData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/admin/coupons`,
        couponData,
        { withCredentials: true }
      );
      return data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "adminCoupon/update",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/v1/admin/coupons/${id}`,
        couponData,
        { withCredentials: true }
      );
      return data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "adminCoupon/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/admin/coupons/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminCouponSlice = createSlice({
  name: "adminCoupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearAdminCouponState: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.unshift(action.payload);
        state.success = "Coupon created successfully";
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        state.success = "Coupon updated successfully";
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
        state.success = "Coupon deleted successfully";
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdminCouponState } = adminCouponSlice.actions;
export default adminCouponSlice.reducer;
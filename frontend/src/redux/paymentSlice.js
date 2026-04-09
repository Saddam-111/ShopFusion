import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/payment/create-order`,
        { amount },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, shippingInfo }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/payment/verify`,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          cart,
          shippingInfo
        },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCODOrder = createAsyncThunk(
  "payment/cod",
  async (shippingInfo, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/payment/cod`,
        { shippingInfo },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    orderId: null,
    amount: 0,
    loading: false,
    error: null,
    order: null,
    success: false
  },
  reducers: {
    resetPayment: (state) => {
      state.orderId = null;
      state.amount = 0;
      state.loading = false;
      state.error = null;
      state.order = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload.orderId;
        state.amount = action.payload.amount;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCODOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCODOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
      })
      .addCase(createCODOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
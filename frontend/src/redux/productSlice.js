import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_SERVER_URL;

// ✅ async thunk for fetching products
// ✅ async thunk for fetching products
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ page = 1, keyword = "", category = "" } = {}, { rejectWithValue }) => {
    try {
      let url = `${baseUrl}/api/v1/products?page=${page}`;

      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
      }

      const { data } = await axios.get(url, { withCredentials: true });

      return data; // make sure backend returns { products, productCount, totalPages... }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// ✅ async thunk for fetching single product details
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/v1/product/${id}`,
        { withCredentials: true }
      );
      return data; // ⚠️ make sure backend returns { product: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],       // ✅ list of products
    product: {},        // ✅ single product details
    productCount: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    resultPerPage: 4
  },
  reducers: {},

  extraReducers: (builder) => {
    // 🔹 Get All Products
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products; // ✅ backend must return products[]
        state.productCount = action.payload.productCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.resultPerPage = action.payload.resultPerPage;

      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔹 Get Single Product
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product; 
        // ⚠️ If backend returns { product: {...} }, then use:
        // state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;

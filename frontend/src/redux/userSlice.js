import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;

//Register API
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/v1/register`, userData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//login API
export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/v1/login`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/profile`, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null);
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null
    },

    removeSucces: (state) => {
      state.success = null
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    //Registration
    builder.addCase(register.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = action.payload.success;
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload?.user);
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    })


    //login
    builder.addCase(login.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = action.payload.success;
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload?.user);
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    })



    //load user Profile
    builder.addCase(loadUser.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = action.payload.success;
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload?.user);
    })
    .addCase(loadUser.rejected, (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
      state.isAuthenticated = false;
    })
  }
})

export const {removeErrors, removeSucces, logoutUser} = userSlice.actions
export default userSlice.reducer
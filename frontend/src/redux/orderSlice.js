
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const authHeaders = (getState) => {
  const token = getState().user.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Cash on Delivery
export const createCODOrder = createAsyncThunk(
  "orders/createCODOrder",
  async ({ items, address }, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(getState),
        },
        body: JSON.stringify({
          items,
          address,
          paymentMethod: "cod",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order failed");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create Razorpay order
export const createPaymentOrder = createAsyncThunk(
  "orders/createPaymentOrder",
  async ({ items, address }, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(getState),
        },
        body: JSON.stringify({ items, address }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Payment failed");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify Razorpay payment
export const verifyPayment = createAsyncThunk(
  "orders/verifyPayment",
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(getState),
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/orders/my-orders`, {
        headers: authHeaders(getState),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to fetch orders");
      return data.orders || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    paymentLoading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCODOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCODOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createCODOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaymentOrder.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state) => {
        state.paymentLoading = false;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.paymentLoading = false;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;

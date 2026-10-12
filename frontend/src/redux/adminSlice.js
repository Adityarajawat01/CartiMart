import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logout, loginUser } from "./userSlice.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const authorizedRequest = (getState) => {
  const token = getState().user.token;
  if (!token) {
    throw new Error("Please sign in again to continue.");
  }

  return { headers: { Authorization: `Bearer ${token}` } };
};

const createAdminThunk = (type, request, fallback) =>
  createAsyncThunk(type,   async (argument, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await request(argument, getState, dispatch);
      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, fallback));
    }
  });

export const fetchAdminDashboard = createAdminThunk(
  "admin/fetchDashboard",
  (_, getState) =>
    axios.get(`${API_URL}/admin/dashboard`, authorizedRequest(getState)),
  "Unable to load the admin dashboard.",
);

export const fetchAdminProducts = createAdminThunk(
  "admin/fetchProducts",
  async (_, getState) => {
    const { data } = await axios.get(
      `${API_URL}/admin/products`,
      authorizedRequest(getState),
    );
    return { ...data, products: data.products ?? data.product ?? [] };
  },
  "Unable to load products.",
);

export const fetchAdminProduct = createAdminThunk(
  "admin/fetchProduct",
  (id, getState) =>
    axios.get(`${API_URL}/admin/products/${id}`, authorizedRequest(getState)),
  "Unable to load product.",
);

export const createAdminProduct = createAdminThunk(
  "admin/createProduct",
  (product, getState) =>
    axios.post(
      `${API_URL}/admin/products`,
      product,
      authorizedRequest(getState),
    ),
  "Unable to create product.",
);

export const updateAdminProduct = createAdminThunk(
  "admin/updateProduct",
  ({ id, product }, getState) =>
    axios.put(
      `${API_URL}/admin/products/${id}`,
      product,
      authorizedRequest(getState),
    ),
  "Unable to update product.",
);

export const deleteAdminProduct = createAdminThunk(
  "admin/deleteProduct",
  (id, getState) =>
    axios.delete(
      `${API_URL}/admin/products/${id}`,
      authorizedRequest(getState),
    ),
  "Unable to delete product.",
);

export const fetchAdminOrders = createAdminThunk(
  "admin/fetchOrders",
  (_, getState) =>
    axios.get(`${API_URL}/admin/orders`, authorizedRequest(getState)),
  "Unable to load orders.",
);

export const updateAdminOrderStatus = createAdminThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, getState, dispatch) => {
    const response = await axios.patch(
      `${API_URL}/admin/orders/${id}/status`,
      { status },
      authorizedRequest(getState),
    );
    dispatch(fetchAdminDashboard());
    return response;
  },
  "Unable to update order status.",
);

const initialState = {
  dashboard: null,
  products: [],
  currentProduct: null,
  orders: [],
  loading: {
    dashboard: false,
    products: false,
    product: false,
    orders: false,
  },
  savingProduct: false,
  deletingProductId: null,
  updatingOrderId: null,
  errors: {
    dashboard: null,
    products: null,
    product: null,
    productForm: null,
    orders: null,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminErrors(state) {
      state.errors = { ...initialState.errors };
    },
    clearCurrentAdminProduct(state) {
      state.currentProduct = null;
      state.errors.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(loginUser.fulfilled, () => initialState)
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading.dashboard = true;
        state.errors.dashboard = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.errors.dashboard = action.payload || action.error.message;
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading.products = true;
        state.errors.products = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products =
          action.payload?.products ?? action.payload?.product ?? [];
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.errors.products = action.payload || action.error.message;
      })
      .addCase(fetchAdminProduct.pending, (state) => {
        state.loading.product = true;
        state.currentProduct = null;
        state.errors.product = null;
      })
      .addCase(fetchAdminProduct.fulfilled, (state, action) => {
        state.loading.product = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchAdminProduct.rejected, (state, action) => {
        state.loading.product = false;
        state.errors.product = action.payload || action.error.message;
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.savingProduct = true;
        state.errors.productForm = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.savingProduct = false;
        state.products.unshift(action.payload.product);
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.savingProduct = false;
        state.errors.productForm = action.payload || action.error.message;
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.savingProduct = true;
        state.errors.productForm = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.savingProduct = false;
        state.currentProduct = action.payload.product;
        state.products = state.products.map((product) =>
          product._id === action.payload.product._id
            ? action.payload.product
            : product,
        );
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.savingProduct = false;
        state.errors.productForm = action.payload || action.error.message;
      })
      .addCase(deleteAdminProduct.pending, (state, action) => {
        state.deletingProductId = action.meta.arg;
        state.errors.products = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.deletingProductId = null;
        state.products = state.products.filter(
          (product) => product._id !== action.meta.arg,
        );
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.deletingProductId = null;
        state.errors.products = action.payload || action.error.message;
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading.orders = true;
        state.errors.orders = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.errors.orders = action.payload || action.error.message;
      })
      .addCase(updateAdminOrderStatus.pending, (state, action) => {
        state.updatingOrderId = action.meta.arg.id;
        state.errors.orders = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.updatingOrderId = null;
        const updatedOrder = action.payload.order;
        state.orders = state.orders.map((order) => {
          if (order._id !== updatedOrder._id) return order;
          return { ...updatedOrder, userId: order.userId };
        });
        if (state.dashboard?.recentOrders) {
          state.dashboard.recentOrders = state.dashboard.recentOrders.map((order) =>
            order._id === updatedOrder._id
              ? { ...updatedOrder, userId: order.userId }
              : order,
          );
        }
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.updatingOrderId = null;
        state.errors.orders = action.payload || action.error.message;
      });
  },
});

export const { clearAdminErrors, clearCurrentAdminProduct } =
  adminSlice.actions;
export default adminSlice.reducer;

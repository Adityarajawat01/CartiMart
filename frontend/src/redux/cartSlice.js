import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, logout } from "./userSlice.js";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/users/shopping-data`;
const GUEST_ID = "guest";

const toProductItems = (cart) =>
  cart
    .filter((item) => item.product)
    .map(({ product, quantity }) => ({ ...product, quantity }));

const isShoppingDataResponse = (data) =>
  data?.success && Array.isArray(data.cart) && Array.isArray(data.wishlist);

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const loadCustomerShoppingData = createAsyncThunk(
  "shoppingData/load",
  async (customerId, { getState, rejectWithValue, signal }) => {
    const token = getState().user.token;
    if (!token || !customerId) {
      return rejectWithValue("Sign in to load your cart and wishlist.");
    }

    try {
      const { data } = await axios.get(API_URL, {
        ...authHeaders(token),
        signal,
      });

      if (!isShoppingDataResponse(data)) {
        return rejectWithValue("The server returned invalid cart or wishlist data.");
      }

      if (!data.initialized) {
        const state = getState();
        const cachedCart =
          state.cart.customerId === customerId
            ? state.cart.items
            : state.cart.itemsByCustomer?.[customerId] || [];
        const cachedWishlist =
          state.wishlist.customerId === customerId
            ? state.wishlist.items
            : state.wishlist.itemsByCustomer?.[customerId] || [];

        if (cachedCart.length || cachedWishlist.length) {
          const migrated = await axios.put(
            API_URL,
            {
              cart: cachedCart.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
              })),
              wishlist: cachedWishlist.map((item) => item._id),
            },
            { ...authHeaders(token), signal },
          );
          if (!isShoppingDataResponse(migrated.data)) {
            return rejectWithValue("The server returned invalid migrated shopping data.");
          }
          return {
            customerId,
            cart: migrated.data.cart,
            wishlist: migrated.data.wishlist,
          };
        }
      }

      return { customerId, cart: data.cart, wishlist: data.wishlist };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to load saved shopping data.",
      );
    }
  },
);

export const saveCustomerShoppingData = createAsyncThunk(
  "shoppingData/save",
  async ({ customerId, token, cart, wishlist }, { rejectWithValue, signal }) => {
    try {
      const { data } = await axios.put(
        API_URL,
        {
          cart: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          wishlist: wishlist.map((item) => item._id),
        },
        { ...authHeaders(token), signal },
      );

      if (!isShoppingDataResponse(data)) {
        return rejectWithValue(
          data.message || "The server returned invalid saved shopping data.",
        );
      }

      return { customerId, cart: data.cart, wishlist: data.wishlist };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to save your cart and wishlist.",
      );
    }
  },
);

const saveCurrentItems = (state) => {
  const customerId = state.customerId || GUEST_ID;
  state.customerId = customerId;
  state.itemsByCustomer ||= {};
  state.itemsByCustomer[customerId] = state.items;
};

const switchCustomer = (state, customerId) => {
  const nextCustomerId = customerId || GUEST_ID;
  state.itemsByCustomer ||= {};

  // Older persisted carts have no owner, so associate them with the signed-in customer.
  const currentCustomerId = state.customerId || nextCustomerId;
  state.itemsByCustomer[currentCustomerId] = state.items || [];
  state.customerId = nextCustomerId;
  state.items = state.itemsByCustomer[nextCustomerId] || [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    customerId: GUEST_ID,
    itemsByCustomer: {},
    syncStatus: "idle",
    syncError: null,
  },

  reducers: {
    setCartCustomer: (state, action) => {
      switchCustomer(state, action.payload);
    },
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else if (product.stock > 0) {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
      saveCurrentItems(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item._id === action.payload
      );

      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
      saveCurrentItems(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCurrentItems(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
      saveCurrentItems(state);
    },

    clearCart: (state) => {
      state.items = [];
      saveCurrentItems(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        switchCustomer(
          state,
          action.payload.user?._id || action.payload.user?.id,
        );
      })
      .addCase(logout, (state) => {
        switchCustomer(state, GUEST_ID);
        state.syncStatus = "idle";
        state.syncError = null;
      })
      .addCase(loadCustomerShoppingData.pending, (state) => {
        state.syncStatus = "loading";
        state.syncError = null;
      })
      .addCase(loadCustomerShoppingData.fulfilled, (state, action) => {
        if (state.customerId !== action.payload.customerId) return;
        state.items = toProductItems(action.payload.cart);
        state.itemsByCustomer[state.customerId] = state.items;
        state.syncStatus = "synced";
      })
      .addCase(loadCustomerShoppingData.rejected, (state, action) => {
        if (action.meta.aborted || state.customerId !== action.meta.arg) return;
        state.syncStatus = "error";
        state.syncError = action.payload || action.error.message;
      })
      .addCase(saveCustomerShoppingData.pending, (state) => {
        state.syncStatus = "syncing";
        state.syncError = null;
      })
      .addCase(saveCustomerShoppingData.fulfilled, (state, action) => {
        if (state.customerId !== action.payload.customerId) return;
        state.items = toProductItems(action.payload.cart);
        state.itemsByCustomer[state.customerId] = state.items;
        state.syncStatus = "synced";
      })
      .addCase(saveCustomerShoppingData.rejected, (state, action) => {
        if (
          action.meta.aborted ||
          state.customerId !== action.meta.arg.customerId
        ) {
          return;
        }
        state.syncStatus = "error";
        state.syncError = action.payload || action.error.message;
      });
  },
});

export const {
  setCartCustomer,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
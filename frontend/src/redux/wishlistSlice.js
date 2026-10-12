
import { createSlice } from "@reduxjs/toolkit";
import {
  loadCustomerShoppingData,
  saveCustomerShoppingData,
} from "./cartSlice.js";
import { loginUser, logout } from "./userSlice.js";

const GUEST_ID = "guest";

const saveCurrentItems = (state) => {
  const customerId = state.customerId || GUEST_ID;
  state.customerId = customerId;
  state.itemsByCustomer ||= {};
  state.itemsByCustomer[customerId] = state.items;
};

const switchCustomer = (state, customerId) => {
  const nextCustomerId = customerId || GUEST_ID;
  state.itemsByCustomer ||= {};

  // Older persisted wishlists have no owner, so associate them with the signed-in customer.
  const currentCustomerId = state.customerId || nextCustomerId;
  state.itemsByCustomer[currentCustomerId] = state.items || [];
  state.customerId = nextCustomerId;
  state.items = state.itemsByCustomer[nextCustomerId] || [];
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    customerId: GUEST_ID,
    itemsByCustomer: {},
    syncStatus: "idle",
    syncError: null,
  },

  reducers: {
    setWishlistCustomer: (state, action) => {
      switchCustomer(state, action.payload);
    },
    addToWishlist: (state, action) => {
      const product = action.payload;

      const exists = state.items.some(
        (item) => item._id === product._id
      );

      if (!exists) {
        state.items.push(product);
      }
      saveCurrentItems(state);
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
      saveCurrentItems(state);
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;

      const exists = state.items.some(
        (item) => item._id === product._id
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => item._id !== product._id
        );
      } else {
        state.items.push(product);
      }
      saveCurrentItems(state);
    },

    clearWishlist: (state) => {
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
        state.items = action.payload.wishlist.filter(Boolean);
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
        state.items = action.payload.wishlist.filter(Boolean);
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
  setWishlistCustomer,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
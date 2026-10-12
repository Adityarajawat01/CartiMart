
import {
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";

import {
  addToCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  saveCustomerShoppingData,
} from "./cartSlice.js";

import {
  addToWishlist,
  clearWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "./wishlistSlice.js";

const SHOPPING_DATA_SYNC_DEBOUNCE_MS = 400;

const shoppingDataSyncListener = createListenerMiddleware();

shoppingDataSyncListener.startListening({
  matcher: isAnyOf(
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  ),

  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();

    await listenerApi.delay(SHOPPING_DATA_SYNC_DEBOUNCE_MS);

    const { user, cart, wishlist } = listenerApi.getState();

    const customerId = user.user?.id || user.user?._id;

    if (!user.token || !customerId) return;

    await listenerApi.dispatch(
      saveCustomerShoppingData(
        {
          customerId,
          token: user.token,
          cart: cart.items,
          wishlist: wishlist.items,
        },
        { signal: listenerApi.signal },
      ),
    );
  },
});

export default shoppingDataSyncListener;

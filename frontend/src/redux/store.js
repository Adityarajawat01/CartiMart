// import {
//   configureStore,
//   combineReducers,
//   createListenerMiddleware,
//   isAnyOf,
// } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";

// import userReducer from "./userSlice.js";
// import ProductReducer from "./productSlice.js";
// import cartReducer from "./cartSlice.js";
// import wishlistReducer from "./wishlistSlice.js";
// import OrderReducer from "./orderSlice.js";
// import adminReducer from "./adminSlice.js";
// import {
//   addToCart,
//   clearCart,
//   decreaseQuantity,
//   increaseQuantity,
//   removeFromCart,
//   saveCustomerShoppingData,
// } from "./cartSlice.js";
// import {
//   addToWishlist,
//   clearWishlist,
//   removeFromWishlist,
//   toggleWishlist,
// } from "./wishlistSlice.js";

// const SHOPPING_DATA_SYNC_DEBOUNCE_MS = 400;

// // Custom localStorage adapter
// const storage = {
//   getItem: (key) => Promise.resolve(localStorage.getItem(key)),
//   setItem: (key, value) => {
//     localStorage.setItem(key, value);
//     return Promise.resolve(value);
//   },
//   removeItem: (key) => {
//     localStorage.removeItem(key);
//     return Promise.resolve();
//   },
// };

// const rootReducer = combineReducers({
//   products: ProductReducer,
//   cart: cartReducer,
//   wishlist: wishlistReducer,
//   user: userReducer,
//   orders: OrderReducer,
//   admin: adminReducer,
// });

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
//   whitelist: ["user", "cart", "wishlist"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const shoppingDataSyncListener = createListenerMiddleware();

// shoppingDataSyncListener.startListening({
//   matcher: isAnyOf(
//     addToCart,
//     increaseQuantity,
//     decreaseQuantity,
//     removeFromCart,
//     clearCart,
//     addToWishlist,
//     removeFromWishlist,
//     toggleWishlist,
//     clearWishlist,
//   ),
//   effect: async (_, listenerApi) => {
//     listenerApi.cancelActiveListeners();
//     await listenerApi.delay(SHOPPING_DATA_SYNC_DEBOUNCE_MS);

//     const { user, cart, wishlist } = listenerApi.getState();
//     const customerId = user.user?.id || user.user?._id;
//     if (!user.token || !customerId) return;

//     await listenerApi.dispatch(
//       saveCustomerShoppingData(
//         {
//           customerId,
//           token: user.token,
//           cart: cart.items,
//           wishlist: wishlist.items,
//         },
//         { signal: listenerApi.signal },
//       ),
//     );
//   },
// });

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           "persist/PERSIST",
//           "persist/REHYDRATE",
//           "persist/REGISTER",
//           "persist/PAUSE",
//           "persist/FLUSH",
//           "persist/PURGE",
//           "persist/REMOVE",
//         ],
//       },
//     }).prepend(shoppingDataSyncListener.middleware),
// });

// export const persistor = persistStore(store);




import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import userReducer from "./userSlice.js";
import ProductReducer from "./productSlice.js";
import cartReducer from "./cartSlice.js";
import wishlistReducer from "./wishlistSlice.js";
import OrderReducer from "./orderSlice.js";
import adminReducer from "./adminSlice.js";

import shoppingDataSyncListener from "./shoppingDataSyncListener.js";

// Custom localStorage adapter
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),

  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve(value);
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// Root reducer
const rootReducer = combineReducers({
  products: ProductReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  user: userReducer,
  orders: OrderReducer,
  admin: adminReducer,
});

// Redux Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "cart", "wishlist"],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// Configure Redux store
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REMOVE",
        ],
      },
    }).prepend(shoppingDataSyncListener.middleware),
});

// Persistor
export const persistor = persistStore(store);

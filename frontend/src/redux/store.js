import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from './productSlice.js'

export const store = configureStore({
  reducer: {
     products : ProductReducer,
  },
});
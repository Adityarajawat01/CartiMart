
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./redux/store.js";
import {
  loadCustomerShoppingData,
  setCartCustomer,
} from "./redux/cartSlice.js";
import { setWishlistCustomer } from "./redux/wishlistSlice.js";

const restoreCustomerShoppingData = () => {
  const customer =
    store.getState().user.user;
  const customerId = customer?.id || customer?._id || "guest";
  store.dispatch(setCartCustomer(customerId));
  store.dispatch(setWishlistCustomer(customerId));

  if (store.getState().user.token && customerId !== "guest") {
    return store.dispatch(loadCustomerShoppingData(customerId));
  }
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={restoreCustomerShoppingData}
      >
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
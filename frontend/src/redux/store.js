import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { customerReducer } from "./reducers/customer";
import { orderReducer } from "./reducers/order";
import { paymentReducer } from "./reducers/payment";

const Store = configureStore({
  reducer: {
    user: userReducer,
    customer: customerReducer,
    order: orderReducer,
    payment: paymentReducer,
  },
});

export default Store;

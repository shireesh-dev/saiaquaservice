import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { customerReducer } from "./reducers/customer";
import { orderReducer } from "./reducers/order";
import { paymentReducer } from "./reducers/payment";
import { invoiceReducer } from "./reducers/invoice";
import { contactReducer } from "./reducers/contact";
import { depositReducer } from "./reducers/deposit";

const Store = configureStore({
  reducer: {
    user: userReducer,
    customer: customerReducer,
    order: orderReducer,
    payment: paymentReducer,
    invoice: invoiceReducer,
    contact: contactReducer,
    deposit: depositReducer,
  },
});

export default Store;

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  // Orders
  orders: [],
  order: null,

  // Status
  loading: false,
  successMessage: null,
  error: null,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder

    //Place order

    .addCase("PlaceOrderRequest", (state) => {
      state.loading = true;
    })
    .addCase("PlaceOrderSuccess", (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.orders.unshift(action.payload); // latest order first
      state.successMessage = "Order placed successfully";
    })
    .addCase("PlaceOrderFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //Get customer order-customerId

    .addCase("GetCustomerOrdersRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetCustomerOrdersSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase("GetCustomerOrdersFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Mark order as paid

    .addCase("MarkOrderPaidRequest", (state) => {
      state.loading = true;
    })
    .addCase("MarkOrderPaidSuccess", (state, action) => {
      state.loading = false;
      state.order = action.payload; // updated order
      state.successMessage = "Order marked as paid";
    })
    .addCase("MarkOrderPaidFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //get all orders-Admin

    .addCase("AdminGetOrdersRequest", (state) => {
      state.loading = true;
    })
    .addCase("AdminGetOrdersSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })

    .addCase("AdminGetOrdersFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Update order status
    .addCase("UpdateOrderStatusRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateOrderStatusSuccess", (state, action) => {
      state.loading = false;

      state.orders = state.orders.map((o) =>
        o._id === action.payload._id ? action.payload : o
      );

      state.successMessage = "Order status updated";
    })
    .addCase("UpdateOrderStatusFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("UpdatePaymentStatusRequest", (state) => {
      state.loading = true;
    })

    .addCase("UpdatePaymentStatusSuccess", (state, action) => {
      state.loading = false;
      state.successMessage = "Payment status updated successfully";

      // Update list
      state.orders = state.orders.map((o) =>
        o._id === action.payload._id ? action.payload : o
      );

      // Update single order
      if (state.order?._id === action.payload._id) {
        state.order = action.payload;
      }
    })

    .addCase("UpdatePaymentStatusFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Create Regular Order

    .addCase("CreateRegularOrderRequest", (state) => {
      state.loading = true;
    })

    .addCase("CreateRegularOrderSuccess", (state, action) => {
      state.loading = false;

      let newOrder = action.payload?.order;

      if (newOrder) {
        // ✅ normalize customer field
        if (typeof newOrder.customer !== "object") {
          newOrder = {
            ...newOrder,
            customer: { _id: newOrder.customer },
          };
        }

        state.orders.unshift(newOrder);
        state.order = newOrder;
      }

      state.successMessage = action.payload.message;
    })

    .addCase("CreateRegularOrderFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("GetOrdersByDateRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetOrdersByDateSuccess", (state, action) => {
      state.loading = false;

      // ✅ Always replace with fresh data for selected date
      state.orders = action.payload || [];
    })
    .addCase("GetOrdersByDateFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Get Customer Monthly Orders

    .addCase("GetCustomerMonthlyOrdersRequest", (state) => {
      state.loading = true;
    })

    .addCase("GetCustomerMonthlyOrdersSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })

    .addCase("GetCustomerMonthlyOrdersFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // 🔹 Share Orders via whatsapp

    .addCase("ShareOrderRequest", (state) => {
      state.loading = true;
    })

    .addCase("ShareOrderSuccess", (state, action) => {
      state.loading = false;

      // ✅ Update shared flag globally (IMPORTANT FIX)
      state.orders = state.orders.map((o) =>
        o._id === action.payload ? { ...o, shared: true } : o
      );

      state.successMessage = "Order shared successfully";
    })

    .addCase("ShareOrderFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //clear states

    .addCase("ClearOrderErrors", (state) => {
      state.error = null;
    })
    .addCase("ClearOrderMessages", (state) => {
      state.successMessage = null;
    });
});

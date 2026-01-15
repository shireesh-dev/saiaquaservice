import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
  payment: null,

  loading: false,
  successMessage: null,
  error: null,
};

export const paymentReducer = createReducer(initialState, (builder) => {
  builder

    /* =====================================================
       MARK PAYMENT AS PAID
    ===================================================== */
    .addCase("MarkPaymentPaidRequest", (state) => {
      state.loading = true;
    })
    .addCase("MarkPaymentPaidSuccess", (state, action) => {
      state.loading = false;
      state.payment = action.payload;
      state.successMessage = "Payment marked as paid";

      // update list if exists
      state.payments = state.payments.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    })
    .addCase("MarkPaymentPaidFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* =====================================================
       ADMIN: GET ALL PAYMENTS
    ===================================================== */
    .addCase("AdminGetPaymentsRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("AdminGetPaymentsSuccess", (state, action) => {
      state.loading = false;
      state.payments = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase("AdminGetPaymentsFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* =====================================================
       ADMIN: UPDATE PAYMENT STATUS
    ===================================================== */
    .addCase("UpdatePaymentStatusRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdatePaymentStatusSuccess", (state, action) => {
      state.loading = false;
      state.successMessage = "Payment status updated successfully";

      // update payment list
      state.payments = state.payments.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );

      // update single payment if opened
      if (state.payment?._id === action.payload._id) {
        state.payment = action.payload;
      }
    })
    .addCase("UpdatePaymentStatusFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* =====================================================
       CLEAR STATES
    ===================================================== */
    .addCase("ClearPaymentErrors", (state) => {
      state.error = null;
    })
    .addCase("ClearPaymentMessages", (state) => {
      state.successMessage = null;
    });
});

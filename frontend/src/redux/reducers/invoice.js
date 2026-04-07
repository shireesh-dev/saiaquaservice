import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  // Data
  invoices: [],
  invoice: null,

  // Pagination + stats
  total: 0,
  page: 1,
  pages: 1,
  stats: {},

  // Loading states
  loading: false,
  createLoading: false,
  fetchLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Messages
  successMessage: null,
  error: null,
};

export const invoiceReducer = createReducer(initialState, (builder) => {
  builder

    // ===============================
    // 🔹 CREATE INVOICE
    // ===============================
    .addCase("CreateInvoiceRequest", (state) => {
      state.createLoading = true;
      state.error = null;
      state.successMessage = null;
    })

    .addCase("CreateInvoiceSuccess", (state, action) => {
      state.createLoading = false;

      const newInvoice = action.payload;

      if (newInvoice) {
        const exists = state.invoices.find((inv) => inv._id === newInvoice._id);

        if (!exists) {
          state.invoices.unshift(newInvoice);
        }

        state.invoice = newInvoice;
      }

      state.successMessage = "Invoice created successfully";
    })

    .addCase("CreateInvoiceFail", (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
    })

    // ===============================
    // 🔹 GET ALL INVOICES
    // ===============================
    .addCase("GetAllInvoicesRequest", (state) => {
      state.fetchLoading = true;
      state.error = null;
    })

    .addCase("GetAllInvoicesSuccess", (state, action) => {
      state.fetchLoading = false;

      state.invoices = action.payload.invoices || [];
      state.total = action.payload.total || 0;
      state.page = action.payload.page || 1;
      state.pages = action.payload.pages || 1;
      state.stats = action.payload.stats || {};
    })

    .addCase("GetAllInvoicesFail", (state, action) => {
      state.fetchLoading = false;
      state.error = action.payload;
    })

    // ===============================
    // 🔹 GET SINGLE INVOICE
    // ===============================
    .addCase("GetInvoiceByIdRequest", (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase("GetInvoiceByIdSuccess", (state, action) => {
      state.loading = false;
      state.invoice = action.payload;
    })

    .addCase("GetInvoiceByIdFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // ===============================
    // 🔹 UPDATE INVOICE PAYMENT
    // ===============================
    .addCase("UpdateInvoicePaymentRequest", (state) => {
      state.updateLoading = true;
      state.error = null;
      state.successMessage = null;
    })

    .addCase("UpdateInvoicePaymentSuccess", (state, action) => {
      state.updateLoading = false;

      const updatedInvoice = action.payload;

      // Update list (optimized)
      const index = state.invoices.findIndex(
        (inv) => inv._id === updatedInvoice._id
      );

      if (index !== -1) {
        state.invoices[index] = updatedInvoice;
      }

      // Update single
      if (state.invoice?._id === updatedInvoice._id) {
        state.invoice = updatedInvoice;
      }

      state.successMessage = "Invoice payment updated";
    })

    .addCase("UpdateInvoicePaymentFail", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    // ===============================
    // 🔹 DELETE INVOICE
    // ===============================
    .addCase("DeleteInvoiceRequest", (state) => {
      state.deleteLoading = true;
      state.error = null;
      state.successMessage = null;
    })

    .addCase("DeleteInvoiceSuccess", (state, action) => {
      state.deleteLoading = false;

      state.invoices = state.invoices.filter(
        (inv) => inv._id !== action.payload
      );

      state.successMessage = "Invoice deleted successfully";
    })

    .addCase("DeleteInvoiceFail", (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    })

    // ===============================
    // 🔹 CLEAR STATES
    // ===============================
    .addCase("ClearInvoiceErrors", (state) => {
      state.error = null;
    })

    .addCase("ClearInvoiceMessages", (state) => {
      state.successMessage = null;
    });
});

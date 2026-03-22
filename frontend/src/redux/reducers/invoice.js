import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  // Invoices
  invoices: [],
  invoice: null,

  // Status
  loading: false,
  successMessage: null,
  error: null,
};

export const invoiceReducer = createReducer(initialState, (builder) => {
  builder

    //create invoice
    .addCase("CreateInvoiceRequest", (state) => {
      state.loading = true;
    })

    .addCase("CreateInvoiceSuccess", (state, action) => {
      state.loading = false;

      const newInvoice = action.payload;

      if (newInvoice) {
        state.invoices.unshift(newInvoice); // latest first
        state.invoice = newInvoice;
      }

      state.successMessage = "Invoice created successfully";
    })

    .addCase("CreateInvoiceFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //get All invoices-Admin
    .addCase("GetAllInvoicesRequest", (state) => {
      state.loading = true;
    })

    .addCase("GetAllInvoicesSuccess", (state, action) => {
      state.loading = false;

      // ✅ If API returns { invoices, total, page... }
      state.invoices = action.payload.invoices || [];
    })

    .addCase("GetAllInvoicesFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //get single invoice
    .addCase("GetInvoiceByIdRequest", (state) => {
      state.loading = true;
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
    // 🔹 UPDATE INVOICE PAYMENT (FUTURE READY)
    // ===============================
    .addCase("UpdateInvoicePaymentRequest", (state) => {
      state.loading = true;
    })

    .addCase("UpdateInvoicePaymentSuccess", (state, action) => {
      state.loading = false;

      const updatedInvoice = action.payload;

      // ✅ Update list
      state.invoices = state.invoices.map((inv) =>
        inv._id === updatedInvoice._id ? updatedInvoice : inv
      );

      // ✅ Update single invoice
      if (state.invoice?._id === updatedInvoice._id) {
        state.invoice = updatedInvoice;
      }

      state.successMessage = "Invoice payment updated";
    })

    .addCase("UpdateInvoicePaymentFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // ===============================
    // 🔹 DELETE INVOICE (OPTIONAL)
    // ===============================
    .addCase("DeleteInvoiceRequest", (state) => {
      state.loading = true;
    })

    .addCase("DeleteInvoiceSuccess", (state, action) => {
      state.loading = false;

      state.invoices = state.invoices.filter(
        (inv) => inv._id !== action.payload
      );

      state.successMessage = "Invoice deleted successfully";
    })

    .addCase("DeleteInvoiceFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //clear states
    .addCase("ClearInvoiceErrors", (state) => {
      state.error = null;
    })

    .addCase("ClearInvoiceMessages", (state) => {
      state.successMessage = null;
    });
});

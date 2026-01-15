import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  // Customer
  customers: [],
  customer: null,

  // Status
  loading: false,
  successMessage: null,
  error: null,
};

export const customerReducer = createReducer(initialState, (builder) => {
  builder

    //create customer -Admin

    .addCase("CreateCustomerRequest", (state) => {
      state.loading = true;
    })
    .addCase("CreateCustomerSuccess", (state, action) => {
      state.loading = false;
      state.customers.push(action.payload);
      state.successMessage = "Customer created successfully";
    })
    .addCase("CreateCustomerFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //get all customers-Admin

    .addCase("GetAllCustomersRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetAllCustomersSuccess", (state, action) => {
      state.loading = false;
      state.customers = action.payload;
    })
    .addCase("GetAllCustomersFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //delete customer -Admin

    .addCase("DeleteCustomerRequest", (state) => {
      state.loading = true;
    })
    .addCase("DeleteCustomerSuccess", (state, action) => {
      state.loading = false;
      state.customers = state.customers.filter(
        (c) => c._id !== action.payload.customerId
      );
      state.successMessage = action.payload.message;
    })
    .addCase("DeleteCustomerFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //update customer information

    .addCase("UpdateCustomerProfileRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateCustomerProfileSuccess", (state, action) => {
      state.loading = false;
      state.customer = action.payload;
      state.successMessage = "Profile updated successfully";
    })
    .addCase("UpdateCustomerProfileFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    //get specific customer details

    .addCase("GetCustomerProfileRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetCustomerProfileSuccess", (state, action) => {
      state.loading = false;
      state.customer = action.payload;
    })
    .addCase("GetCustomerProfileFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //clear states

    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("clearMessages", (state) => {
      state.successMessage = null;
    });
});

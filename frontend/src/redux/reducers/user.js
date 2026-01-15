import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  successMessage: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    // --- Load User ---
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    })

    // --- Login Admin ---
    .addCase("LoginAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoginAdminSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("LoginAdminFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    })

    // --- Register Admin ---
    .addCase("RegisterAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("RegisterAdminSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("RegisterAdminFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    })

    // --- Logout Admin ---
    .addCase("LogoutAdminRequest", (state) => {
      state.loading = true;
    })
    .addCase("LogoutAdminSuccess", (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.successMessage = "Logged out successfully";
    })
    .addCase("LogoutAdminFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // --- Clear Errors & Messages ---
    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("clearMessages", (state) => {
      state.successMessage = null;
    });
});

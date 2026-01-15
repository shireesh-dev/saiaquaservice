import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  AdminLogin,
  Register,
  HomePage,
  EditCustomer,
  AdminHomePage,
  CreateCustomer,
  AllCustomers,
  AllOrdersPage,
  AllPaymentsPage,
} from "./routes/HomeRoutes";

import PlaceOrder from "./pages/PlaceOrder";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentPage from "./pages/PaymentPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/edit-customer" element={<EditCustomer />} />
        <Route path="/admin/create-customer" element={<CreateCustomer />} />
        <Route path="/admin/customers" element={<AllCustomers />} />
        <Route path="/admin/orders" element={<AllOrdersPage />} />
        <Route path="/admin/payments" element={<AllPaymentsPage />} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;

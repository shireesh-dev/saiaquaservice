import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/user";
import "./App.css";

// Public Pages (Bootstrap + App.css)
import HomePage from "./pages/HomePage";
import PlaceOrder from "./pages/PlaceOrder";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentPage from "./pages/PaymentPage";

// Admin Pages (Tailwind + index.css)
import {
  AdminLogin,
  AdminRegister,
  AdminLayout,
  AdminHomePage,
  CreateCustomer,
  EditCustomer,
  AllCustomers,
  AllOrdersPage,
  AllPaymentsPage,
  RegularCustomerPage,
  AllInvoicePage,
} from "./routes/HomeRoutes";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public Routes (Homepage) ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        {/* ---------- Admin Routes (Tailwind) ---------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/regular-customers"
          element={<RegularCustomerPage />}
        />
        <Route path="/admin/invoices" element={<AllInvoicePage />} />

        {/* Admin Panel Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="create-customer" element={<CreateCustomer />} />
          <Route path="edit-customer" element={<EditCustomer />} />
          <Route path="customers" element={<AllCustomers />} />
          <Route path="orders" element={<AllOrdersPage />} />
          <Route path="payments" element={<AllPaymentsPage />} />
        </Route>
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

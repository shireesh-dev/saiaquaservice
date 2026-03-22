import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin, loadUser } from "../redux/actions/user";
import {
  FaUserPlus,
  FaUserEdit,
  FaUsers,
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaChartBar,
  FaSignOutAlt,
  FaUserCheck,
  FaFileInvoice,
} from "react-icons/fa";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  // Load admin on page load
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Redirect if not authenticated and not loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);
  // Logout Handler
  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    toast.success("Logged out successfully");
  };

  const cards = [
    {
      title: "Create Customer",
      icon: <FaUserPlus size={22} />,
      path: "/admin/create-customer",
      color: "bg-blue-600",
    },
    {
      title: "Edit Customer",
      icon: <FaUserEdit size={22} />,
      path: "/admin/edit-customer",
      color: "bg-indigo-600",
    },
    {
      title: "Customers List",
      icon: <FaUsers size={22} />,
      path: "/admin/customers",
      color: "bg-teal-600",
    },
    {
      title: "Orders",
      icon: <FaShoppingCart size={22} />,
      path: "/admin/orders",
      color: "bg-orange-500",
    },
    {
      title: "Regular Customers",
      icon: <FaUserCheck size={22} />,
      path: "/admin/regular-customers",
      color: "bg-cyan-600",
    },
    {
      title: "Payment Status",
      icon: <FaMoneyCheckAlt size={22} />,
      path: "/admin/payments",
      color: "bg-green-600",
    },
    {
      title: "Invoices", // ✅ NEW
      icon: <FaFileInvoice size={22} />,
      path: "/admin/invoices",
      color: "bg-pink-600",
    },
    {
      title: "Reports",
      icon: <FaChartBar size={22} />,
      path: "/admin/reports",
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Manage customers, orders & payments
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 
              text-white text-sm font-semibold hover:bg-red-700 active:scale-95 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.map((item, index) => (
            <button
              type="button"
              onClick={() => navigate(item.path)}
              className={`${item.color} text-white rounded-xl p-4 flex flex-col 
              items-center justify-center shadow-md hover:scale-105 
              active:scale-95 transition`}
            >
              <div className="mb-2">{item.icon}</div>
              <span className="text-sm sm:text-base font-semibold text-center">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

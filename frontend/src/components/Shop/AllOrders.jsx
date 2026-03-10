import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllOrders,
  updateOrderStatus,
} from "../../redux/actions/order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

const AllOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("today");

  // 🔔 Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { orders, loading, error, successMessage } = useSelector(
    (state) => state.order
  );

  // ✅ Fetch orders on page load
  useEffect(() => {
    dispatch(adminGetAllOrders());
  }, [dispatch]);

  // 🔔 Socket Order Notification
  useEffect(() => {
    const handleNewOrder = (data) => {
      console.log("📥 New order received:", data);

      // toast alert
      toast.info(`🛒 New Order from ${data.customerName} (₹${data.total})`, {
        position: "top-right",
        autoClose: 4000,
      });

      // 🔊 Voice Notification
      const msg = new SpeechSynthesisUtterance(
        `New order received from ${data.customerName}. Order total is rupees ${data.total}`
      );
      msg.lang = "en-IN";
      msg.rate = 1;
      msg.pitch = 1;
      window.speechSynthesis.speak(msg);

      // 🔔 Save notification
      const newNotification = {
        id: Date.now(),
        message: `New Order from ${data.customerName} - ₹${data.total}`,
        time: new Date().toLocaleTimeString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // refresh orders
      dispatch(adminGetAllOrders());
    };

    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [dispatch]);

  // ❌ error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // ✅ success toast
  useEffect(() => {
    if (successMessage) toast.success(successMessage);
  }, [successMessage]);

  // ✅ filtering logic
  useEffect(() => {
    let tempOrders = Array.isArray(orders) ? [...orders] : [];

    // search filter
    if (search.trim()) {
      const term = search.toLowerCase();

      tempOrders = tempOrders.filter(
        (o) =>
          o._id?.toLowerCase().includes(term) ||
          o.customer?.name?.toLowerCase().includes(term) ||
          o.customer?.phoneNumber?.includes(term)
      );
    }

    // today filter
    if (filterType === "today") {
      const today = new Date();

      tempOrders = tempOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);

        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });
    }

    // pending filter
    if (filterType === "pending") {
      tempOrders = tempOrders.filter((o) => o.orderStatus === "pending");
    }

    // last 3 days
    if (filterType === "last3days") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      tempOrders = tempOrders.filter(
        (o) => new Date(o.createdAt) >= threeDaysAgo
      );
    }

    setFilteredOrders(tempOrders);
  }, [orders, search, filterType]);

  // 🔔 Open notifications
  const openNotifications = () => {
    setUnreadCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Orders</h2>

          {/* 🔔 Notification Bell */}
          <div className="relative cursor-pointer" onClick={openNotifications}>
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by Order ID / Customer / Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-96"
          />

          <button
            onClick={() => setSearch("")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="border border-gray-400 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilterType("today")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === "today"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Today's Orders
          </button>

          <button
            onClick={() => setFilterType("pending")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilterType("last3days")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === "last3days"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Last 3 Days
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border divide-y">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Products</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((o, index) => (
                  <tr key={o._id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>

                    <td className="px-4 py-2">{o.customer?.name || "-"}</td>

                    <td className="px-4 py-2">
                      {o.customer?.phoneNumber || "-"}
                    </td>

                    <td className="px-4 py-2">
                      {Array.isArray(o.products) && o.products.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {o.products.map((p, i) => (
                            <li key={i}>
                              {p.productName} × {p.quantity} — ₹{p.price}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-2 text-emerald-600 font-semibold">
                      ₹{o.orderTotal}
                    </td>

                    <td className="px-4 py-2">
                      <select
                        value={o.orderStatus}
                        onChange={(e) =>
                          dispatch(updateOrderStatus(o._id, e.target.value))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {notifications.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Recent Notifications</h3>

            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="bg-gray-50 p-2 rounded mb-2 text-sm">
                {n.message} — ₹{n.amount} ({n.time})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;

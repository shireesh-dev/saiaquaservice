import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllOrders,
  updateOrderStatus,
} from "../../redux/actions/order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("today");

  const { orders, loading, error, successMessage } = useSelector(
    (state) => state.order
  );

  // Fetch all orders
  useEffect(() => {
    dispatch(adminGetAllOrders());
  }, [dispatch]);

  // Error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Success toast
  useEffect(() => {
    if (successMessage) toast.success(successMessage);
  }, [successMessage]);

  useEffect(() => {
    let tempOrders = [...orders];

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      tempOrders = tempOrders.filter(
        (o) =>
          o._id.toLowerCase().includes(term) ||
          (o.customer?.name && o.customer.name.toLowerCase().includes(term)) ||
          (o.customer?.phoneNumber && o.customer.phoneNumber.includes(term))
      );
    }

    // Filter by type
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
    } else if (filterType === "pending") {
      tempOrders = tempOrders.filter((o) => o.orderStatus === "pending");
    } else if (filterType === "last3") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      tempOrders = tempOrders.filter(
        (o) => new Date(o.createdAt) >= threeDaysAgo
      );
    }

    setFilteredOrders(tempOrders);
  }, [orders, search, filterType]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
          All Orders
        </h2>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Search by Order ID / Customer / Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-96 flex-1"
          />

          <button
            onClick={() => setSearch("")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>

        {/* Order Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilterType("today")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === "today"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Today's Orders
          </button>

          <button
            onClick={() => setFilterType("pending")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending Orders
          </button>

          <button
            onClick={() => setFilterType("last3days")}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === "last3days"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Last 3 Days
          </button>
        </div>

        {/* Orders Table */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Products
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Total
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Order Status
                  </th>

                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((o, index) => (
                  <tr key={o._id}>
                    <td className="px-4 py-2 font-semibold">{index + 1}</td>

                    <td className="px-4 py-2 text-sm">
                      {o.customer?.name || "-"}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {o.customer?.phoneNumber || "-"}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {Array.isArray(o.products) && o.products.length > 0 ? (
                        <ul className="list-disc ml-4 space-y-1">
                          {o.products.map((p, index) => (
                            <li key={index}>
                              {p.productName} × {p.quantity} —{" "}
                              <span className="font-semibold">₹{p.price}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm font-semibold text-emerald-600">
                      ₹{o.orderTotal}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      <select
                        value={o.orderStatus}
                        onChange={(e) =>
                          dispatch(updateOrderStatus(o._id, e.target.value))
                        }
                        className={`border rounded-md px-2 py-1 text-sm font-semibold
      ${
        o.orderStatus === "delivered"
          ? "bg-green-50 text-green-700"
          : o.orderStatus === "cancelled"
          ? "bg-red-50 text-red-700"
          : "bg-yellow-50 text-yellow-700"
      }
    `}
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;

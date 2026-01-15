import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllPayments,
  updatePaymentStatus,
} from "../../redux/actions/payment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FILTERS = {
  TODAY: "today",
  UNPAID: "unpaid",
  LAST3: "last3",
};

const AllPayments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState(FILTERS.TODAY);
  const paymentState = useSelector((state) => state.payment);
  console.log("🟡 Redux payment state:", paymentState);
  const {
    payments = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.payment || {});

  console.log("🟢 Payments array:", payments);

  // Fetch payments
  useEffect(() => {
    dispatch(adminGetAllPayments());
  }, [dispatch]);

  // Toasts
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
  }, [successMessage]);

  // Filtering + Search
  const filteredPayments = useMemo(() => {
    let temp = [...payments];

    // 🔍 Search
    if (search.trim()) {
      const term = search.toLowerCase();
      temp = temp.filter(
        (p) =>
          p._id.toLowerCase().includes(term) ||
          p.order?._id?.toLowerCase().includes(term) ||
          p.order?.customer?.name?.toLowerCase().includes(term) ||
          p.order?.customer?.phoneNumber?.includes(term)
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterType === FILTERS.TODAY) {
      temp = temp.filter((p) => {
        const d = new Date(p.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
    }

    if (filterType === FILTERS.UNPAID) {
      temp = temp.filter((p) => p.paymentStatus === "unpaid");
    }

    if (filterType === FILTERS.LAST3) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      temp = temp.filter((p) => new Date(p.createdAt) >= threeDaysAgo);
    }

    return temp;
  }, [payments, search, filterType]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">All Payments</h2>

        {/* 🔍 Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by Payment / Order / Customer / Phone"
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
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>

        {/* 🔘 Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilterType(FILTERS.TODAY)}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === FILTERS.TODAY
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setFilterType(FILTERS.UNPAID)}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === FILTERS.UNPAID
                ? "bg-red-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Unpaid
          </button>

          <button
            onClick={() => setFilterType(FILTERS.LAST3)}
            className={`px-4 py-2 rounded-md font-semibold ${
              filterType === FILTERS.LAST3
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Last 3 Days
          </button>
        </div>

        {/* 📋 Table */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredPayments.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No payments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredPayments.map((p, i) => (
                  <tr key={p._id}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {p.order?.customer?.name || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {p.order?.customer?.phoneNumber || "-"}
                    </td>
                    <td className="px-4 py-2 font-semibold text-emerald-600">
                      ₹{p.amount}
                    </td>

                    {/* ✅ Status Update */}
                    <td className="px-4 py-2">
                      <select
                        value={p.paymentStatus}
                        onChange={(e) =>
                          dispatch(updatePaymentStatus(p._id, e.target.value))
                        }
                        className={`border rounded-md px-2 py-1 font-semibold text-sm
                          ${
                            p.paymentStatus === "paid"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                      >
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    </td>

                    <td className="px-4 py-2">
                      {new Date(p.createdAt).toLocaleDateString()}
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

export default AllPayments;

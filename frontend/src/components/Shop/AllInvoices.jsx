import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getAllInvoices, createInvoice } from "../../redux/actions/invoice";

import { getAllCustomers } from "../../redux/actions/customer";

const AllInvoices = () => {
  const dispatch = useDispatch();

  const { invoices, loading, error, successMessage } = useSelector(
    (state) => state.invoice
  );

  const { customers } = useSelector((state) => state.customer);

  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [customerType, setCustomerType] = useState("regular");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [generating, setGenerating] = useState(false);

  // 🔹 Fetch data
  useEffect(() => {
    dispatch(getAllInvoices());
    dispatch(getAllCustomers());
  }, [dispatch]);

  // 🔹 Toast handling
  useEffect(() => {
    if (error) toast.error(error);
    if (successMessage) toast.success(successMessage);
  }, [error, successMessage]);

  // 🔹 Filter invoices
  useEffect(() => {
    const filtered = invoices.filter(
      (inv) => inv.customer?.customerType === customerType
    );
    setFilteredInvoices(filtered);
  }, [customerType, invoices]);

  // 🔥 GENERATE INVOICE (BULK)
  const handleGenerateInvoice = async () => {
    if (!fromDate || !toDate) {
      return toast.error("Please select fromDate and toDate");
    }

    try {
      setGenerating(true);

      const selectedCustomers = customers.filter(
        (c) => c.customerType === customerType
      );

      if (selectedCustomers.length === 0) {
        return toast.error(`No ${customerType} customers found`);
      }

      // 🔥 Sequential dispatch (safe)
      for (let c of selectedCustomers) {
        await dispatch(
          createInvoice({
            customerId: c._id,
            fromDate,
            toDate,
          })
        );
      }

      toast.success("Invoices generated successfully ✅");

      // 🔄 Refresh invoices
      dispatch(getAllInvoices());
    } catch (err) {
      console.error(err);
      toast.error("Error generating invoices");
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">All Invoices</h2>

        {/* 🔥 Toggle Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setCustomerType("regular")}
            className={`px-4 py-2 rounded-md ${
              customerType === "regular"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Regular Customers
          </button>

          <button
            onClick={() => setCustomerType("non-regular")}
            className={`px-4 py-2 rounded-md ${
              customerType === "non-regular"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Non-Regular Customers
          </button>
        </div>

        {/* 🔥 DATE + GENERATE */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

          <button
            onClick={handleGenerateInvoice}
            disabled={generating}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {generating ? "Generating..." : "Generate Invoice"}
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredInvoices.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No {customerType} invoices found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Invoice No</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Period</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Paid</th>
                  <th className="px-4 py-2">Due</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv._id}>
                    <td className="px-4 py-2">{inv.invoiceNumber}</td>
                    <td className="px-4 py-2">{inv.customer?.name}</td>
                    <td className="px-4 py-2">{inv.customer?.phoneNumber}</td>
                    <td className="px-4 py-2">
                      {formatDate(inv.fromDate)} - {formatDate(inv.toDate)}
                    </td>
                    <td className="px-4 py-2">₹ {inv.total}</td>
                    <td className="px-4 py-2">₹ {inv.paidAmount}</td>
                    <td className="px-4 py-2 text-red-600">
                      ₹ {inv.dueAmount}
                    </td>
                    <td className="px-4 py-2">{inv.status}</td>
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

export default AllInvoices;

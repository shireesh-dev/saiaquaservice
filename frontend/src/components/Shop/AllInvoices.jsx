import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
import Swal from "sweetalert2";

import { createInvoice } from "../../redux/actions/invoice";
import { server } from "../../server";
import InvoiceHtmlView from "../../components/Shop/InvoiceHtmlView";
import InvoicePdfView from "../../components/Shop/InvoicePdfView";

const AllInvoices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createLoading, error, successMessage } = useSelector(
    (state) => state.invoice
  );

  const [month, setMonth] = useState("");
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Toasts
  useEffect(() => {
    if (error) toast.error(error);
    if (successMessage) toast.success(successMessage);
  }, [error, successMessage]);

  // 🔥 Fetch Orders
  const fetchOrdersByMonth = async () => {
    if (!month) {
      return toast.error("Please select a month first");
    }

    try {
      setGroupedOrders([]);

      const { data } = await axios.get(
        `${server}/order/by-month?month=${month}`,
        { withCredentials: true }
      );

      setGroupedOrders(data.groupedOrders || []);
      setSelectedCustomers([]);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  // 🔥 Toggle select
  const toggleCustomer = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // 🔥 Generate Selected
  const handleGenerateInvoice = async () => {
    if (!month) return toast.error("Select month");

    if (!selectedCustomers.length) {
      return toast.error("Select at least one customer");
    }

    try {
      setGenerating(true);

      const [year, m] = month.split("-");
      const fromDate = new Date(year, m - 1, 1);
      const toDate = new Date(year, m, 0);

      await Promise.all(
        selectedCustomers.map((customerId) =>
          dispatch(
            createInvoice({
              customerId,
              fromDate,
              toDate,
            })
          ).catch(() => {})
        )
      );

      toast.success("Selected invoices generated ✅");

      setSelectedCustomers([]);
      await fetchOrdersByMonth(); // 🔥 reload with updated status
    } catch (err) {
      toast.error("Error generating invoices");
    } finally {
      setGenerating(false);
    }
  };

  // 🔥 Generate ALL
  const handleGenerateAllInvoices = async () => {
    if (!month) return toast.error("Select month");

    if (!groupedOrders.length) {
      return toast.error("No customers found");
    }

    const confirm = await Swal.fire({
      title: "Generate all invoices?",
      text: "This will create invoices for all customers",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, generate",
    });

    if (!confirm.isConfirmed) return;

    try {
      setGenerating(true);

      const [year, m] = month.split("-");
      const fromDate = new Date(year, m - 1, 1);
      const toDate = new Date(year, m, 0);

      await Promise.all(
        groupedOrders.map((item) =>
          dispatch(
            createInvoice({
              customerId: item.customer._id,
              fromDate,
              toDate,
            })
          ).catch(() => {})
        )
      );

      toast.success("All invoices generated successfully ✅");

      setSelectedCustomers([]);
      await fetchOrdersByMonth();
    } catch (err) {
      toast.error("Error generating all invoices");
    } finally {
      setGenerating(false);
    }
  };

  const getMonthRange = () => {
    if (!month) return "";

    const [year, m] = month.split("-");
    const from = new Date(year, m - 1, 1);
    const to = new Date(year, m, 0);

    return `${from.toLocaleDateString("en-IN")} - ${to.toLocaleDateString(
      "en-IN"
    )}`;
  };

  // 🔥 View invoice
  const handleViewInvoice = async (invoiceId) => {
    const { data } = await axios.get(`${server}/invoice/${invoiceId}`, {
      withCredentials: true,
    });

    setSelectedInvoice(data.invoice);
    setShowModal(true);
  };

  // 🔥 PDF
  const handlePDFView = async (invoiceId) => {
    const { data } = await axios.get(`${server}/invoice/${invoiceId}`, {
      withCredentials: true,
    });

    setSelectedInvoice(data.invoice);
    setShowPDFModal(true);
  };

  // 🔥 WhatsApp
  const handleWhatsApp = (phone, invoiceId) => {
    const pdfUrl = `${server}/invoice/pdf/${invoiceId}`;

    const message = `🧾 Invoice Ready\nDownload here:\n${pdfUrl}`;

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Monthly Invoices</h2>

        {/* FILTER */}
        <div className="flex gap-3 mb-4">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

          <button
            onClick={fetchOrdersByMonth}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Fetch Orders
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="border px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>

        {/* TABLE */}
        {groupedOrders.length > 0 && (
          <>
            <div className="flex justify-between mb-3 items-center">
              <p className="font-semibold">Period: {getMonthRange()}</p>

              <div className="flex gap-3">
                {/* Generate Selected */}
                <button
                  onClick={handleGenerateInvoice}
                  disabled={generating || createLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  {generating ? "Generating..." : "Generate Selected"}
                </button>

                {/* Generate All */}
                <button
                  onClick={handleGenerateAllInvoices}
                  disabled={!groupedOrders.length || generating}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md"
                >
                  {generating ? "Generating..." : "Generate All"}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Select</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>View</th>
                    <th>PDF</th>
                    <th>WhatsApp</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedOrders.map((item) => (
                    <tr key={item.customer._id}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          disabled={item.invoiceGenerated}
                          checked={selectedCustomers.includes(
                            item.customer._id
                          )}
                          onChange={() => toggleCustomer(item.customer._id)}
                        />
                      </td>

                      <td>{item.customer.name}</td>
                      <td>{item.customer.phoneNumber}</td>
                      <td>{item.totalOrders}</td>
                      <td>₹ {item.totalAmount}</td>

                      <td>
                        {item.invoiceGenerated ? (
                          <span className="text-green-600 font-semibold">
                            ✅ Generated
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            ❌ Not Generated
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          onClick={() => handleViewInvoice(item.invoiceId)}
                          className="text-blue-600"
                        >
                          View
                        </button>
                      </td>

                      <td>
                        <button onClick={() => handlePDFView(item.invoiceId)}>
                          PDF
                        </button>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            handleWhatsApp(
                              item.customer.phoneNumber,
                              item.invoiceId
                            )
                          }
                        >
                          Share
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* MODAL */}
        {showModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow max-h-[90vh] overflow-auto">
              <button
                onClick={() => setShowModal(false)}
                className="mb-2 text-red-500"
              >
                Close
              </button>

              <InvoiceHtmlView data={selectedInvoice} />
            </div>
          </div>
        )}
      </div>

      {showPDFModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded shadow relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPDFModal(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>

            {/* PDF Viewer */}
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <InvoicePdfView data={selectedInvoice} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInvoices;

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../../redux/actions/customer";
import {
  createRegularOrder,
  getOrdersByDate,
  deleteOrder,
} from "../../redux/actions/order";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegularCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customers } = useSelector((state) => state.customer);
  const { loading, orders } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [quantities, setQuantities] = useState({});
  const [localOrderMap, setLocalOrderMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // Fetch customers
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  // Fetch orders by date
  useEffect(() => {
    if (deliveryDate) {
      dispatch(getOrdersByDate(deliveryDate));
    }
  }, [deliveryDate, dispatch]);

  useEffect(() => {
    const map = {};

    orders?.forEach((o) => {
      if (o.customer?._id && o.deliveryDate) {
        const date = new Date(o.deliveryDate).toISOString().split("T")[0];
        map[`${o.customer._id}_${date}`] = o;
      }
    });

    setLocalOrderMap(map);
  }, [orders]);

  // Reset quantity when date changes
  useEffect(() => {
    setQuantities({});
  }, [deliveryDate]);

  // ✅ Single source of truth
  const getExistingOrder = (customerId) => {
    if (!deliveryDate) return null;

    return orders?.find((o) => {
      const orderDate = new Date(o.deliveryDate).toLocaleDateString("en-CA");

      return (
        o.customer?._id?.toString() === customerId.toString() &&
        orderDate === deliveryDate
      );
    });
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    let temp = Array.isArray(customers) ? [...customers] : [];

    temp = temp.filter((c) => c.customerType === "regular");

    if (search.trim()) {
      const term = search.toLowerCase();
      temp = temp.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) || c.phoneNumber?.includes(term)
      );
    }

    return temp;
  }, [customers, search]);

  const getOrderQuantity = (order) => {
    if (!order || !Array.isArray(order.products)) return 0;

    // all products have same quantity
    return order.products.length > 0 ? order.products[0].quantity || 0 : 0;
  };

  // Quantity select
  const handleQuantityChange = (customerId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [customerId]: prev[customerId] === value ? 0 : value,
    }));
  };

  // Create Order
  const handleCreateOrder = async (customerId) => {
    if (!deliveryDate) {
      toast.error("Please select delivery date");
      return;
    }

    const quantity = quantities[customerId];
    if (!quantity) {
      toast.error("Please select quantity");
      return;
    }

    try {
      // 🔒 lock button
      setLoadingMap((prev) => ({ ...prev, [customerId]: true }));

      const res = await dispatch(
        createRegularOrder(customerId, deliveryDate, quantity)
      );

      toast.success(res?.message || "Order placed successfully");

      await dispatch(getOrdersByDate(deliveryDate));

      setQuantities((prev) => ({
        ...prev,
        [customerId]: 0,
      }));
    } catch (err) {
      toast.error(err.message || "Order failed");
    } finally {
      // 🔓 unlock button
      setLoadingMap((prev) => ({ ...prev, [customerId]: false }));
    }
  };
  // Calculate total
  const calculateTotal = (customer) => {
    const existingOrder = getExistingOrder(customer._id);

    const quantity =
      quantities[customer._id] ?? getOrderQuantity(existingOrder);

    if (!quantity) return 0;

    const productTotal =
      customer.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

    return productTotal * quantity;
  };

  //Bulk order creation  -Admin

  const handleBulkOrder = async () => {
    if (!deliveryDate) {
      toast.error("Please select delivery date");
      return;
    }

    // 🔍 filter valid customers
    const customersToProcess = filteredCustomers.filter((c) => {
      const existingOrder = getExistingOrder(c._id);
      const quantity = quantities[c._id];

      return !existingOrder && quantity > 0;
    });

    if (customersToProcess.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Orders",
        text: "No valid customers selected",
      });
      return;
    }

    // ✅ SweetAlert Confirmation
    const result = await Swal.fire({
      title: "Create Bulk Orders?",
      html: `
        <b>${customersToProcess.length}</b> customers selected<br/>
        Orders will be created for selected quantities
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Create",
    });

    if (!result.isConfirmed) return;

    try {
      // 🔄 Show loading popup
      Swal.fire({
        title: "Processing...",
        text: "Creating bulk orders, please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 🔒 lock buttons
      const loadingIds = {};
      customersToProcess.forEach((c) => {
        loadingIds[c._id] = true;
      });
      setLoadingMap((prev) => ({ ...prev, ...loadingIds }));

      // 🚀 API calls
      const results = await Promise.allSettled(
        customersToProcess.map((c) =>
          dispatch(createRegularOrder(c._id, deliveryDate, quantities[c._id]))
        )
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;

      const failCount = results.filter((r) => r.status === "rejected").length;

      // ✅ Close loader + show result
      Swal.fire({
        icon: successCount > 0 ? "success" : "error",
        title: "Bulk Order Result",
        html: `
          ✅ Success: <b>${successCount}</b><br/>
          ❌ Failed: <b>${failCount}</b>
        `,
      });

      // 🔄 refresh
      await dispatch(getOrdersByDate(deliveryDate));

      // 🧹 reset quantities
      const newQuantities = { ...quantities };
      customersToProcess.forEach((c) => {
        delete newQuantities[c._id];
      });
      setQuantities(newQuantities);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Bulk Order Failed",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingMap({});
    }
  };

  //delete order -Admin
  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingMap((prev) => ({ ...prev, [orderId]: true }));

      const res = await dispatch(deleteOrder(orderId));

      toast.success(res?.message || "Order cancelled successfully");
      await dispatch(getOrdersByDate(deliveryDate));
    } catch (err) {
      toast.error(err.message || "Cancel failed");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Regular Customer Orders</h2>

          <button
            onClick={() => navigate("/admin")}
            className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Back
          </button>
        </div>

        {/* SEARCH + DATE */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

          <input
            type="text"
            placeholder="Search by name / phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-96"
          />

          <button
            onClick={() => setSearch("")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Clear
          </button>

          <button
            onClick={handleBulkOrder}
            disabled={!deliveryDate}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
          >
            Bulk Order
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No regular customers found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border divide-y">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th>Sr.No</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((c, index) => {
                  const existingOrder = getExistingOrder(c._id);
                  const qty =
                    quantities[c._id] ?? getOrderQuantity(existingOrder);

                  return (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      <td>{index + 1}</td>
                      <td>{c.name || "-"}</td>
                      <td>{c.phoneNumber || "-"}</td>

                      <td>
                        {c.products?.map((p, i) => (
                          <div key={i}>{p.productName}</div>
                        ))}
                      </td>

                      <td>
                        {c.products?.map((p, i) => (
                          <div key={i}>₹{p.price}</div>
                        ))}
                      </td>

                      {/* Qty */}
                      <td>
                        {[1, 2, 3, 4, 5].map((q) => (
                          <button
                            key={q}
                            disabled={!!existingOrder}
                            onClick={() => handleQuantityChange(c._id, q)}
                            className={`m-1 px-2 py-1 border ${
                              qty === q ? "bg-emerald-600 text-white" : ""
                            } ${
                              existingOrder
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </td>

                      {/* Total */}
                      <td>{qty ? `₹${calculateTotal(c)}` : "-"}</td>

                      {/* Action */}
                      <td>
                        {existingOrder ? (
                          <button
                            disabled={loadingMap[existingOrder._id]}
                            onClick={() => handleDeleteOrder(existingOrder._id)}
                            className={`px-2 py-1 rounded text-white ${
                              loadingMap[existingOrder._id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {loadingMap[existingOrder._id]
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        ) : (
                          <button
                            disabled={loadingMap[c._id]}
                            onClick={() => handleCreateOrder(c._id)}
                            className={`px-2 py-1 rounded text-white ${
                              loadingMap[c._id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {loadingMap[c._id] ? "Creating..." : "Create Order"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegularCustomer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, clearOrderErrors } from "../redux/actions/order";
import { server } from "../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successMessage, error, order } = useSelector(
    (state) => state.order
  );

  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (order && order._id) {
      toast.success("Order confirmed");

      navigate(`/payment/${order._id}`);
    }

    if (error) {
      toast.error(error);
      dispatch({ type: "ClearOrderErrors" });
    }
  }, [order, error, dispatch, navigate]);

  // 🔍 Search customer
  const handleSearchCustomer = async () => {
    if (!phoneNumber) {
      toast.error("Enter phone number");
      return;
    }

    try {
      setSearching(true);
      const { data } = await axios.get(
        `${server}/order/search-customer-phoneNumber?phoneNumber=${phoneNumber}`
      );

      setCustomer(data.customer);
      setProducts(
        data.customer.products.map((p) => ({
          productName: p.productName || "",
          price: Number(p.price) || 0, // Convert to number
          quantity: Number(p.quantity) || 1, // Convert to number
          selected: true,
        }))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Customer not found");
      setCustomer(null);
      setProducts([]);
    } finally {
      setSearching(false);
    }
  };

  // ✅ Toggle product selection
  const toggleProduct = (index) => {
    const updated = [...products];
    updated[index].selected = !updated[index].selected;
    setProducts(updated);
  };

  // 🔄 Quantity change
  const updateQty = (index, delta) => {
    const updated = [...products];
    if (!updated[index].selected) return;

    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    setProducts(updated);
  };

  // 🚀 Place Order
  const handlePlaceOrder = () => {
    const selectedProducts = products.filter((p) => p.selected);

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    dispatch(placeOrder(customer._id, selectedProducts));
  };

  // 🧮 Line total
  const getLineTotal = (p) => {
    if (!p.selected) return 0;
    return Number(p.price) * Number(p.quantity);
  };

  // 🧮 Grand total
  const getGrandTotal = () => {
    return products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
      0
    );
  };

  // 🔔 Toast handling
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setPhoneNumber("");
      setCustomer(null);
      setProducts([]);
    }
    if (error) {
      toast.error(error);
      dispatch(clearOrderErrors());
    }
  }, [successMessage, error, dispatch]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 pb-10">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        {/* Header */}
        <h1 className="text-xl font-bold text-sky-700 text-center">
          🚚 Place Order
        </h1>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <label className="text-sm font-medium text-gray-600">
            Customer Phone Number
          </label>

          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-3"
            />

            <button
              onClick={handleSearchCustomer}
              disabled={searching}
              className="bg-sky-600 text-white px-4 py-3 rounded-lg text-sm font-semibold"
            >
              {searching ? "..." : "Search"}
            </button>
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full mt-2 border border-gray-300 text-gray-700 py-2.5 
                     rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

        {/* Customer */}
        {customer && (
          <div className="bg-white rounded-xl shadow p-4">
            <p className="font-semibold">{customer.name}</p>
            <p className="font-semibold">{customer.address}</p>
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800">🛒 Products</h3>

            {products.map((p, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={p.selected}
                    onChange={() => toggleProduct(index)}
                    className="w-5 h-5 accent-emerald-600"
                  />

                  <p className="text-base font-semibold">{p.productName}</p>
                </div>

                {/* Price */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price / Unit</span>
                  <span className="font-semibold">₹{p.price}</span>
                </div>

                {/* Qty & Total */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      disabled={!p.selected}
                      onClick={() => updateQty(index, -1)}
                      className={`w-10 h-10 rounded-full font-bold
                        ${
                          p.selected ? "bg-gray-100" : "bg-gray-200 opacity-50"
                        }`}
                    >
                      −
                    </button>

                    <span className="text-lg font-bold">{p.quantity}</span>

                    <button
                      disabled={!p.selected}
                      onClick={() => updateQty(index, 1)}
                      className={`w-10 h-10 rounded-full font-bold text-white
                        ${
                          p.selected
                            ? "bg-emerald-600"
                            : "bg-gray-300 opacity-50"
                        }`}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-emerald-600">
                      ₹{getLineTotal(p)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPreview && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 space-y-4">
              {/* Header */}
              <h2 className="text-lg font-bold text-center text-sky-700">
                📦 Order Preview
              </h2>

              {/* Customer */}
              <div className="text-sm space-y-1">
                <p className="font-semibold">{customer.name}</p>
                <p className="text-gray-600">{customer.address}</p>
                <p className="text-gray-600">📞 {phoneNumber}</p>
              </div>

              {/* Products */}
              <div className="space-y-3 max-h-60 overflow-auto">
                {products
                  .filter((p) => p.selected)
                  .map((p, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b pb-2 text-sm"
                    >
                      <div>
                        <p className="font-semibold">{p.productName}</p>
                        <p className="text-gray-500">
                          {p.quantity} × ₹{p.price}
                        </p>
                      </div>

                      <p className="font-semibold text-emerald-600">
                        ₹{p.quantity * p.price}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-emerald-600">₹{getGrandTotal()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-xl font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setIsConfirmed(true);
                    setShowPreview(false);
                    toast.success("Order confirmed. Please place the order.");
                  }}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-semibold"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {customer && products.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <div className="flex gap-2 font-semibold">
              <span>Grand Total:</span>
              <span className="text-emerald-600">₹{getGrandTotal()}</span>
            </div>

            {!isConfirmed ? (
              <button
                onClick={() => setShowPreview(true)}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-lg font-semibold"
              >
                Preview Order
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-sky-600 text-white py-2.5 rounded-xl text-lg font-semibold"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PlaceOrder;

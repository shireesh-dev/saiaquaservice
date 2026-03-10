import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Static for now (can come from backend later)
  const upiId = "12234455565@ybl.co.in";
  const qrImageUrl = "/qr_codes/sai_aqua.jpeg";

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `order-${orderId}-upi-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaid = async () => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${server}/payment/mark-paid/${orderId}`
      );

      toast.success("Thank you! Payment received 🙏");
      setShowThankYou(true);

      setTimeout(() => {
        navigate(`/order-success/${orderId}`);
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "Order already paid") {
        toast.info("Order already paid ✅");
        setAlreadyPaid(true);
      } else {
        toast.error(message || "Payment update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNotPaid = () => {
    toast.info("You can complete payment later.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <h1 className="text-xl font-bold text-center text-sky-700">
          💳 Payment
        </h1>

        {/* Order ID */}
        <p className="text-center text-xs text-gray-500">Order ID: {orderId}</p>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={qrImageUrl}
            alt="UPI QR Code"
            className="w-56 h-56 object-contain border rounded-xl"
          />

          <button
            onClick={handleDownloadQR}
            className="text-sm font-semibold text-sky-600 underline"
          >
            Download QR Code
          </button>
        </div>

        {/* UPI ID */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">UPI ID</p>
          <p className="text-lg font-bold text-gray-800">{upiId}</p>
        </div>

        {/* Thank You Message */}
        {showThankYou && (
          <div className="text-center text-emerald-600 font-semibold">
            🎉 Thank you! Payment received 🙏
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleNotPaid}
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
          >
            Not Paid
          </button>

          <button
            onClick={handlePaid}
            disabled={loading || alreadyPaid}
            className={`flex-1 py-2.5 rounded-xl font-semibold ${
              alreadyPaid
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-emerald-600 text-white"
            }`}
          >
            {alreadyPaid ? "Already Paid" : loading ? "Processing..." : "Paid"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

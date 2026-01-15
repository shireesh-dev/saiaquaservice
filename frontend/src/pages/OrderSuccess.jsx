import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 text-center space-y-5">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-emerald-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-emerald-700">
          Order Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600">
          Thank you for your payment 🙏 Your order has been confirmed
          successfully.
        </p>

        {/* Order ID */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-semibold text-gray-800 break-all">{orderId}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-3">
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

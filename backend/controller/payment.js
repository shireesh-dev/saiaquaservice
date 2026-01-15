const express = require("express");
const router = express.Router();
const Payment = require("../model/payment");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

//payment -mark as a paid
router.put("/mark-paid/:orderId", async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message: "Order already paid",
    });
  }

  // update order
  order.paymentStatus = "paid";
  order.paidAt = new Date();
  await order.save();

  // create payment only if not exists
  const existingPayment = await Payment.findOne({ order: order._id });

  if (!existingPayment) {
    await Payment.create({
      order: order._id,
      amount: order.orderTotal,
      paymentStatus: "paid", // ✅ correct field
      paidAt: new Date(),
    });
  }

  res.status(200).json({
    success: true,
    message: "Payment recorded successfully",
    order,
  });
});

// Admin: Get all payments

router.get(
  "/admin-get-payments",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    const { type = "today" } = req.query;
    let filter = {};
    const now = new Date();

    // Filter: Today's payments (last 24 hours)
    if (type === "today") {
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: last24Hours };
    }

    // Filter: Unpaid payments
    if (type === "unpaid") {
      filter.paymentStatus = "unpaid";
    }

    // Filter: Last 3 days
    if (type === "last3") {
      const last3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: last3Days };
    }

    const payments = await Payment.find(filter)
      .populate({
        path: "order",
        populate: { path: "customer", select: "name phoneNumber" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  })
);

//Update payment status

router.put(
  "/update-payment-status/:paymentId",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    const { paymentStatus } = req.body;

    // Validate status
    if (!["unpaid", "paid", "failed", "pending"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // 1️⃣ Find payment and populate order + customer
    const payment = await Payment.findById(req.params.paymentId).populate({
      path: "order",
      populate: {
        path: "customer",
        select: "name phoneNumber",
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // 2️⃣ Update payment
    payment.paymentStatus = paymentStatus;
    payment.paidAt = paymentStatus === "paid" ? new Date() : null;
    await payment.save();

    // 3️⃣ Sync order status
    if (payment.order) {
      payment.order.paymentStatus = paymentStatus;
      payment.order.paidAt = payment.paidAt;
      await payment.order.save();
    }

    // 4️⃣ Return fully populated payment
    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      payment, // ✅ includes order.customer populated
    });
  })
);

module.exports = router;

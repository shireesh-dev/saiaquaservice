const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"],
  },

  paymentMethod: {
    type: String,
    enum: ["cash", "upi"], // add methods you want
  },

  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "failed", "pending"],
    default: "unpaid",
  },

  transactionId: {
    type: String,
    default: null,
  },

  paidAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Optional: Auto-update order paymentStatus
 * whenever a payment is marked as paid
 */
paymentSchema.post("save", async function (doc, next) {
  if (doc.paymentStatus === "paid") {
    const Order = mongoose.model("Order");
    await Order.findByIdAndUpdate(doc.order, {
      paymentStatus: "paid",
      paidAt: doc.paidAt || new Date(),
    });
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    // 🔹 Invoice period (monthly)
    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    month: {
      type: String, // e.g. "2026-03"
      required: true,
      index: true,
    },

    // 🔥 Link Orders
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // 🔹 Aggregated products from orders
    products: [
      {
        productName: {
          type: String,
          enum: ["20 liter water bottle", "chilled water jar"],
          required: true,
        },
        totalQuantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          required: true,
        },
        totalAmount: {
          type: Number,
          default: 0,
        },
      },
    ],

    // 🔹 Totals
    subTotal: {
      type: Number,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    // 🔹 Payments
    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    advanceAmount: {
      type: Number,
      default: 0,
    },

    previousDue: {
      type: Number,
      default: 0,
    },

    previousAdvance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
      index: true,
    },

    // 🔹 Payment integration
    paymentLink: String,
    qrCode: String,

    // 🔹 Invoice meta
    invoiceNumber: {
      type: String,
      unique: true,
      index: true,
    },

    notes: String,
  },
  { timestamps: true }
);

// ✅ Prevent duplicate monthly invoice
invoiceSchema.index({ customer: 1, month: 1 }, { unique: true });
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ status: 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);

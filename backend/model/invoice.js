const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    // 🔹 Invoice period
    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    // 🔹 Products summary
    products: [
      {
        productName: {
          type: String,
          enum: ["20 liter water bottle", "chilled water jar"],
          required: true,
        },

        totalQuantity: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        totalAmount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],

    // 🔹 Totals
    subTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔹 Payments
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    advanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    previousDue: {
      type: Number,
      default: 0,
      min: 0,
    },

    previousAdvance: {
      type: Number,
      default: 0,
      min: 0,
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

// ✅ Prevent duplicate invoice for same period
invoiceSchema.index({ customer: 1, fromDate: 1, toDate: 1 }, { unique: true });

// 🔥 Auto Calculation Middleware
invoiceSchema.pre("save", function (next) {
  let sub = 0;

  this.products.forEach((p) => {
    p.totalAmount = Number((p.totalQuantity * p.price).toFixed(2));
    sub += p.totalAmount;
  });

  this.subTotal = Number(sub.toFixed(2));

  // ✅ Total Calculation
  this.total = Number(
    (
      this.subTotal +
      (this.deliveryCharge || 0) -
      (this.discount || 0) +
      (this.previousDue || 0) -
      (this.previousAdvance || 0)
    ).toFixed(2)
  );

  // ✅ Paid cannot exceed total
  if (this.paidAmount > this.total) {
    this.advanceAmount = this.paidAmount - this.total;
    this.paidAmount = this.total;
  }

  // ✅ Due
  this.dueAmount = Number((this.total - this.paidAmount).toFixed(2));

  // ✅ Status
  if (this.dueAmount <= 0) {
    this.status = "paid";
  } else if (this.paidAmount > 0) {
    this.status = "partial";
  } else {
    this.status = "unpaid";
  }

  next();
});

// 🔥 Auto Invoice Number Generator
invoiceSchema.pre("validate", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();

    const year = new Date().getFullYear();

    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);

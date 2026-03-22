const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // ✅ Reference Customer model
    required: true,
  },

  products: [
    {
      productName: {
        type: String,
        enum: ["20 liter water bottle", "chilled water jar"],
        required: true,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },

      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },

      itemTotal: {
        type: Number,
        default: 0,
      },
    },
  ],

  orderTotal: {
    type: Number,
    default: 0,
    min: [0, "Order total cannot be negative"],
  },

  orderStatus: {
    type: String,
    enum: ["pending", "delivered", "cancelled"],
    default: "pending",
  },
  deliveryDate: {
    type: Date,
    required: false,
  },

  shared: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * 🔹 Auto-calculate totals
 */
orderSchema.pre("save", function (next) {
  let total = 0;

  this.products = this.products.map((p) => {
    p.itemTotal = p.quantity * p.price;
    total += p.itemTotal;
    return p;
  });

  this.orderTotal = total;
  next();
});

orderSchema.index(
  { customer: 1, deliveryDate: 1 },
  {
    unique: true,
    partialFilterExpression: { deliveryDate: { $exists: true } },
  }
);

module.exports = mongoose.model("Order", orderSchema);

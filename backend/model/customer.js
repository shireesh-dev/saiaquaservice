const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter customer name"],
    trim: true,
  },

  phoneNumber: {
    type: String,
    required: [true, "Please enter phone number"],
    unique: true,
    trim: true,
  },

  address: {
    type: String,
    required: [true, "Please enter address"],
    trim: true,
  },

  customerType: {
    type: String,
    enum: ["regular", "non-regular"],
    default: "non-regular",
    trim: true,
  },

  // ✅ Products with quantity & price
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
        default: 1,
      },

      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },
    },
  ],

  role: {
    type: String,
    enum: ["customer"],
    default: "customer",
    immutable: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", customerSchema);

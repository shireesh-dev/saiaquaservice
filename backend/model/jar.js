const mongoose = require("mongoose");

const jarSchema = new mongoose.Schema({
  jarType: {
    type: String,
    enum: ["small", "big"], // Only these two types
    required: [true, "Please specify jar type!"],
    unique: true, // ensure no duplicate types
  },

  price: {
    type: Number,
    required: [true, "Please specify the price!"],
    min: [0, "Price cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Jar", jarSchema);

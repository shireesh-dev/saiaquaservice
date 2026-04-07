const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. INV-MAR-2026
  value: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);

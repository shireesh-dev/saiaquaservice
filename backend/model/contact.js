// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 faster search
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 NEW (important for business use)
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    source: {
      type: String,
      default: "website",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);

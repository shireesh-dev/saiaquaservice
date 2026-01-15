const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter admin name"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Please enter password"],
    select: false,
    minlength: [4, "Password should be at least 4 characters"],
  },

  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
    immutable: true, // cannot be changed
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔐 Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

// 🔍 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

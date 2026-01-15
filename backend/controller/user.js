const express = require("express");
const router = express.Router();
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

//admin register
router.post(
  "/admin/register",
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new ErrorHandler("Name, email and password are required", 400)
      );
    }

    if (password.length < 4) {
      return next(
        new ErrorHandler("Password must be at least 4 characters", 400)
      );
    }

    // Optional: allow only ONE admin
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return next(new ErrorHandler("Admin already exists", 403));
    }

    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "admin",
    });

    sendToken(admin, 201, res);
  })
);

//admin login

router.post(
  "/admin/login",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }

    const admin = await User.findOne({
      email: email.toLowerCase(),
      role: "admin",
    }).select("+password");

    if (!admin) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(admin, 200, res);
  })
);

//admin profile

router.get(
  "/me",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  })
);
//admin -logout

router.get("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;

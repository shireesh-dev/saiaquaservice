const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Jar = require("../model/jar");
const ErrorHandler = require("../utils/ErrorHandler");

// Admin: Create a jar
router.post(
  "/create-jar",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { jarType, price } = req.body;

    if (!jarType || price == null) {
      return next(new ErrorHandler("Please provide jar type and price", 400));
    }

    const existingJar = await Jar.findOne({ jarType });
    if (existingJar) {
      return next(new ErrorHandler("Jar type already exists", 400));
    }

    const jar = await Jar.create({ jarType, price });

    res.status(201).json({
      success: true,
      message: "Jar added successfully",
      jar,
    });
  })
);

// Admin: Update price of a jar type

router.put(
  "/update-price",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { jarType, price } = req.body;

    if (!jarType) {
      return next(new ErrorHandler("Please provide jar type", 400));
    }

    const jar = await Jar.findOne({ jarType });
    if (!jar) {
      return next(new ErrorHandler("Jar type not found", 404));
    }

    if (price != null) jar.price = price;

    await jar.save();

    res.status(200).json({
      success: true,
      message: "Jar price updated successfully",
      jar,
    });
  })
);

// Admin: Get all jars (price info only)

router.get(
  "/all-jars-prices",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const jars = await Jar.find().select("jarType price"); // only jarType and price

    res.status(200).json({
      success: true,
      message: "All jars fetched successfully",
      jars,
    });
  })
);

module.exports = router;

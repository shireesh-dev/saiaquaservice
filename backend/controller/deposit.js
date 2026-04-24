const express = require("express");
const router = express.Router();

const Deposit = require("../model/deposit");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

//create deposit
router.post(
  "/create-deposit",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { customer, amount, note } = req.body;

    if (!customer || !amount) {
      return next(new ErrorHandler("Customer and amount are required", 400));
    }

    if (amount <= 0) {
      return next(new ErrorHandler("Amount must be greater than 0", 400));
    }

    const deposit = await Deposit.create({
      customer,
      amount,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Deposit added successfully",
      deposit,
    });
  })
);

//get all deposits
router.get(
  "/all",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    const deposits = await Deposit.find()
      .populate("customer", "name phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deposits.length,
      deposits,
    });
  })
);

//get deposit by customer
router.get(
  "/customer/:customerId",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    const deposits = await Deposit.find({
      customer: req.params.customerId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      deposits,
    });
  })
);

//get customer balance
router.get(
  "/balance/:customerId",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    const deposits = await Deposit.find({
      customer: req.params.customerId,
    });

    const balance = deposits.reduce((acc, item) => acc + item.amount, 0);

    res.status(200).json({
      success: true,
      balance,
    });
  })
);

//delete deposit
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return next(new ErrorHandler("Deposit not found", 404));
    }

    await deposit.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deposit deleted successfully",
    });
  })
);

module.exports = router;

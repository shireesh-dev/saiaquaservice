const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Invoice = require("../model/invoice");
const Order = require("../model/order");

const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//generate invoice
router.post(
  "/create-invoice",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const {
        customerId,
        fromDate,
        toDate,
        deliveryCharge = 0,
        discount = 0,
      } = req.body;

      if (!customerId || !fromDate || !toDate) {
        return res.status(400).json({
          success: false,
          message: "customerId, fromDate, toDate are required",
        });
      }

      // ❗ Prevent duplicate invoice
      const existingInvoice = await Invoice.findOne({
        customer: customerId,
        fromDate,
        toDate,
      });

      if (existingInvoice) {
        return res.status(400).json({
          success: false,
          message: "Invoice already exists for this period",
        });
      }

      // 1️⃣ Fetch orders
      const orders = await Order.find({
        customer: customerId,
        deliveryDate: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
        orderStatus: { $ne: "cancelled" },
      }).populate("customer");

      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No orders found for this period",
        });
      }

      // 2️⃣ Aggregate products
      const productMap = {};

      orders.forEach((order) => {
        order.products.forEach((p) => {
          if (!productMap[p.productName]) {
            productMap[p.productName] = {
              productName: p.productName,
              totalQuantity: 0,
              price: p.price,
              totalAmount: 0,
            };
          }

          productMap[p.productName].totalQuantity += p.quantity;
          productMap[p.productName].totalAmount += p.itemTotal;
        });
      });

      const products = Object.values(productMap);

      // 3️⃣ Carry forward
      const lastInvoice = await Invoice.findOne({ customer: customerId }).sort({
        createdAt: -1,
      });

      const previousDue = lastInvoice?.dueAmount || 0;
      const previousAdvance = lastInvoice?.advanceAmount || 0;

      // 4️⃣ Create invoice
      const invoice = await Invoice.create(
        [
          {
            customer: customerId,
            fromDate,
            toDate,
            products,
            deliveryCharge,
            discount,
            previousDue,
            previousAdvance,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        invoice: invoice[0],
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  })
);

//get all invoices
router.get(
  "/get-invoices",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    let { page = 1, limit = 10, customerId, status } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    if (customerId) query.customer = customerId;
    if (status) query.status = status;

    const total = await Invoice.countDocuments(query);

    const invoices = await Invoice.find(query)
      .populate("customer", "name phoneNumber address")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      invoices,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  })
);

//get single invoice by id
router.get(
  "/:invoiceId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId).populate(
      "customer",
      "name phoneNumber address"
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      invoice,
    });
  })
);

module.exports = router;

const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const User = require("../model/user");
const Customer = require("../model/customer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { io } = require("../server");

// PUBLIC: Place an order
router.post(
  "/place-order",
  catchAsyncErrors(async (req, res, next) => {
    const { customerId, products } = req.body;

    // 1️⃣ Validation
    if (!customerId || !Array.isArray(products) || products.length === 0) {
      return next(new ErrorHandler("Customer and products are required", 400));
    }

    // 2️⃣ Fetch customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // 3️⃣ Build order products (price from DB, NOT frontend)
    const orderProducts = products.map((p) => {
      const customerProduct = customer.products.find(
        (cp) => cp.productName === p.productName
      );

      if (!customerProduct) {
        throw new ErrorHandler(
          `Product ${p.productName} not assigned to customer`,
          400
        );
      }

      if (!p.quantity || p.quantity < 1) {
        throw new ErrorHandler(`Invalid quantity for ${p.productName}`, 400);
      }

      return {
        productName: customerProduct.productName,
        quantity: Number(p.quantity),
        price: customerProduct.price, // 🔐 price from DB
      };
    });

    // 4️⃣ Create order (totals calculated in model middleware)
    const order = await Order.create({
      customer: customer._id,
      products: orderProducts,
    });

    // 🔔 5️⃣ Emit notification to admin
    req.app.locals.io.emit("newOrder", {
      orderId: order._id,
      customerName: customer.name,
      phone: customer.phoneNumber,
      total: order.orderTotal,
      createdAt: order.createdAt,
    });

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  })
);

// get-order customer
router.get(
  "/get-orders/:customerId",
  catchAsyncErrors(async (req, res, next) => {
    const { customerId } = req.params;

    const orders = await Order.find({ customer: customerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// 4️⃣ Admin: Get all orders
router.get(
  "/admin-get-orders",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
      .populate("customer", "name phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// admin - update order status
router.put(
  "/update-status/:orderId",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["pending", "delivered", "cancelled"];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.orderId).populate("customer");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  })
);

// Public: Search customer by phone number
router.get(
  "/search-customer-phoneNumber",
  catchAsyncErrors(async (req, res, next) => {
    const { phoneNumber } = req.query;

    // 1️⃣ Validation
    if (!phoneNumber) {
      return next(new ErrorHandler("Phone number is required", 400));
    }

    // 2️⃣ Normalize phone number
    const normalizedPhone = phoneNumber.toString().trim();

    // 3️⃣ Search customer
    const customer = await Customer.findOne({
      phoneNumber: normalizedPhone,
    }).select("name phoneNumber address customerType products");

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // 4️⃣ Response (safe, public)
    res.status(200).json({
      success: true,
      customer: {
        _id: customer._id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        customerType: customer.customerType,
        products: customer.products.map((p) => ({
          productName: p.productName,
          price: p.price,
          quantity: p.quantity || 1,
        })),
      },
    });
  })
);

module.exports = router;

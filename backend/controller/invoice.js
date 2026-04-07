const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Invoice = require("../model/invoice");
const Order = require("../model/order");
const Counter = require("../model/counter");

const PDFDocument = require("pdfkit");

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

      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      //  Extract month & year FIRST
      const monthIndex = start.getMonth();
      const year = start.getFullYear();

      const monthNumber = String(monthIndex + 1).padStart(2, "0");
      const monthKey = `${year}-${monthNumber}`; // 👉 "2026-03"

      // ❗ Prevent duplicate (BEST WAY)
      const existingInvoice = await Invoice.findOne({
        customer: customerId,
        month: monthKey,
      }).session(session);

      if (existingInvoice) {
        return res.status(400).json({
          success: false,
          message: "Invoice already exists for this month",
        });
      }

      // 1️⃣ Fetch delivered orders
      const orders = await Order.find({
        customer: customerId,
        deliveryDate: { $gte: start, $lte: end },
        orderStatus: "delivered",
      }).session(session);

      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No delivered orders found",
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

      // 3️⃣ Calculate totals
      const subTotal = products.reduce((acc, p) => acc + p.totalAmount, 0);

      // 4️⃣ Carry forward
      const lastInvoice = await Invoice.findOne({
        customer: customerId,
      })
        .sort({ createdAt: -1 })
        .session(session);

      const previousDue = lastInvoice?.dueAmount || 0;
      const previousAdvance = lastInvoice?.advanceAmount || 0;

      const total =
        subTotal + deliveryCharge - discount + previousDue - previousAdvance;

      //  5️⃣ GENERATE INVOICE NUMBER (COUNTER)

      const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      const monthName = monthNames[monthIndex]; // 👉 MAR

      const counterKey = `INV-${monthName}-${year}`;

      const counter = await Counter.findOneAndUpdate(
        { key: counterKey },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      const invoiceNumber = `INV-${monthName}-${year}-${String(
        counter.value
      ).padStart(3, "0")}`;

      // 6️⃣ Create invoice
      const invoice = await Invoice.create(
        [
          {
            invoiceNumber,
            customer: customerId,
            fromDate,
            toDate,
            month: monthKey, // ✅ IMPORTANT
            orders: orders.map((o) => o._id),
            products,
            subTotal,
            deliveryCharge,
            discount,
            previousDue,
            previousAdvance,
            total,
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
    let {
      page = 1,
      limit = 10,
      customerId,
      status,
      fromDate,
      toDate,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    // 🔹 Filters
    if (customerId) query.customer = customerId;
    if (status) query.status = status;

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    // 🔹 Search (customer name / phone)
    let customerFilter = {};
    if (search) {
      const customers = await mongoose.model("Customer").find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
        ],
      });

      customerFilter.customer = { $in: customers.map((c) => c._id) };
    }

    const finalQuery = { ...query, ...customerFilter };

    // 🔹 Sorting
    const sortOrder = order === "asc" ? 1 : -1;

    const total = await Invoice.countDocuments(finalQuery);

    const invoices = await Invoice.find(finalQuery)
      .populate("customer", "name phoneNumber address")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    //  Summary (Dashboard use)
    const stats = await Invoice.aggregate([
      { $match: finalQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalPaid: { $sum: "$paidAmount" },
          totalDue: { $sum: "$dueAmount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      invoices,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats: stats[0] || {
        totalRevenue: 0,
        totalPaid: 0,
        totalDue: 0,
      },
    });
  })
);

//  Get invoice by invoiceId
router.get(
  "/:invoiceId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { invoiceId } = req.params;

    // ✅ Validate
    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    // ✅ Fetch invoice
    const invoice = await Invoice.findById(invoiceId)
      .populate("customer", "name phoneNumber address")
      .populate({
        path: "orders",
        select: "products orderTotal deliveryDate orderStatus",
      });

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

//  Generate REAL PDF by invoiceId
router.get(
  "/pdf/:invoiceId",
  catchAsyncErrors(async (req, res, next) => {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId)
      .populate("customer", "name phoneNumber address")
      .populate({
        path: "orders",
        select: "products orderTotal deliveryDate orderStatus",
      });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    //  Create PDF
    const doc = new PDFDocument({ margin: 30 });

    // Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // 🔹 TITLE
    doc.fontSize(18).text("WATER DELIVERY INVOICE", { align: "center" });
    doc.moveDown();

    // 🔹 CUSTOMER
    doc.fontSize(12).text(`Invoice No: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(
      `Period: ${new Date(invoice.fromDate).toLocaleDateString()} - ${new Date(
        invoice.toDate
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    doc.text(`Customer: ${invoice.customer.name}`);
    doc.text(`Phone: ${invoice.customer.phoneNumber}`);
    doc.text(`Address: ${invoice.customer.address}`);

    doc.moveDown();

    // 🔹 PRODUCTS
    doc.text("Products:", { underline: true });

    invoice.products.forEach((p) => {
      doc.text(
        `${p.productName} | Qty: ${p.totalQuantity} | ₹${p.price} | Total: ₹${p.totalAmount}`
      );
    });

    doc.moveDown();

    // 🔹 TOTALS
    doc.text(`Subtotal: ₹${invoice.subTotal}`);
    doc.text(`Delivery: ₹${invoice.deliveryCharge}`);
    doc.text(`Discount: ₹${invoice.discount}`);
    doc.text(`Total: ₹${invoice.total}`);
    doc.text(`Paid: ₹${invoice.paidAmount}`);
    doc.text(`Due: ₹${invoice.dueAmount}`);

    doc.moveDown();

    doc.text(`Status: ${invoice.status.toUpperCase()}`);

    doc.end();
  })
);

module.exports = router;

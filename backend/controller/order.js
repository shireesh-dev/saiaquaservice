const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const Invoice = require("../model/invoice");
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
    let order = await Order.create({
      customer: customer._id,
      products: orderProducts,
    });

    // ✅  Populate customer details
    order = await order.populate("customer", "name phoneNumber address");

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

// Regular Customer - Place Order
router.post(
  "/admin/regular-order",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { customerId, deliveryDate, quantity } = req.body;

    // 1️⃣ Validate input
    if (!customerId || !deliveryDate) {
      return next(
        new ErrorHandler("Customer ID and delivery date are required", 400)
      );
    }

    if (quantity === undefined || quantity === null) {
      return next(new ErrorHandler("Quantity is required", 400));
    }

    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 5) {
      return next(
        new ErrorHandler("Quantity must be an integer between 0 and 5", 400)
      );
    }

    // 2️⃣ If quantity = 0 → do not create order
    if (quantity === 0) {
      return res.status(200).json({
        success: true,
        message: "Quantity is 0, order not created",
      });
    }

    // 3️⃣ Normalize delivery date (important)
    const normalizedDate = new Date(deliveryDate);
    if (isNaN(normalizedDate)) {
      return next(new ErrorHandler("Invalid delivery date", 400));
    }
    normalizedDate.setHours(0, 0, 0, 0);

    // 4️⃣ Check duplicate order (fast check)
    const existingOrder = await Order.findOne({
      customer: customerId,
      deliveryDate: normalizedDate,
    }).select("_id");

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already exists for this customer on this date",
      });
    }

    // 5️⃣ Fetch customer (only required fields)
    const customer = await Customer.findById(customerId).select(
      "customerType products"
    );

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    if (customer.customerType !== "regular") {
      return next(new ErrorHandler("Customer is not a regular customer", 400));
    }

    if (!customer.products || customer.products.length === 0) {
      return next(new ErrorHandler("Customer has no assigned products", 400));
    }

    // 6️⃣ Build order products
    const orderProducts = customer.products.map((p) => ({
      productName: p.productName,
      quantity,
      price: p.price,
    }));

    // 7️⃣ Create order
    try {
      const order = await Order.create({
        customer: customer._id,
        deliveryDate: normalizedDate,
        products: orderProducts,
      });

      return res.status(201).json({
        success: true,
        message: "Regular order created successfully",
        order,
      });
    } catch (error) {
      //  Handle duplicate index (race condition safety)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Order already exists (duplicate request)",
        });
      }

      return next(error);
    }
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
      .populate("customer", "name phoneNumber address")
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
// Get Orders for a Specific Date -regular customer
router.get(
  "/admin/orders-by-date",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { date } = req.query;

    if (!date) {
      return next(new ErrorHandler("Date is required", 400));
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      deliveryDate: { $gte: start, $lte: end },
    })
      .populate("customer", "name phoneNumber address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  })
);
//Get Monthly Orders for Regular Customer
router.get(
  "/admin/customer-month-orders",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { customerId, month, year } = req.query;

    if (!customerId || !month || !year) {
      return next(new ErrorHandler("Customer, month and year required", 400));
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const orders = await Order.find({
      customer: customerId,
      deliveryDate: { $gte: start, $lte: end },
    }).sort({ deliveryDate: 1 });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// Cancel Order
router.delete(
  "/admin/cancel-order/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  })
);

//Share orders via whatsapp
router.post(
  "/:orderId/share",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.params;

    // 1️⃣ Find order and populate customer
    const order = await Order.findById(orderId).populate(
      "customer",
      "name phoneNumber address"
    );

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    if (!order.customer?.phoneNumber) {
      return next(new ErrorHandler("Customer phone number not available", 400));
    }

    // 2️⃣ Format products
    const productList = order.products
      ?.map(
        (p) => `${p.productName} x ${p.quantity} = ₹${p.price * p.quantity}`
      )
      .join("\n");

    // 3️⃣ Customer address
    const address = order.customer.address || "Address not available";

    // 4️⃣ WhatsApp message
    const message = `🛒 *Order Details*

👤 Customer: ${order.customer.name}
📞 Phone: ${order.customer.phoneNumber}
🏠 Address: ${address}

📦 Products:
${productList}

💰 Total: ₹${order.orderTotal}

Thank you for your order!`;

    // 5️⃣ Generate WhatsApp URL
    const phone = order.customer.phoneNumber.replace(/\D/g, "");
    // NEW ✅ (No phone → allows group selection)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;

    // 6️⃣ Mark as shared in DB
    order.shared = true;
    await order.save();

    // 7️⃣ Respond with link
    res.status(200).json({
      success: true,
      whatsappUrl,
    });
  })
);

// Get Orders by Month (ONLY REGULAR CUSTOMERS)
router.get(
  "/by-month",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { month } = req.query;

    // ✅ 1. Validate
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required (format: YYYY-MM)",
      });
    }

    const [year, m] = month.split("-");
    const yearNum = Number(year);
    const monthNum = Number(m);

    if (!yearNum || !monthNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid month format. Use YYYY-MM",
      });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 01 and 12",
      });
    }

    // ✅ 2. Date Range
    const start = new Date(yearNum, monthNum - 1, 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(yearNum, monthNum, 0);
    end.setHours(23, 59, 59, 999);

    // ✅ 3. Fetch orders
    const orders = await Order.find({
      orderStatus: "delivered",
      deliveryDate: { $gte: start, $lte: end },
    })
      .populate({
        path: "customer",
        select: "name phoneNumber address customerType",
        match: { customerType: "regular" },
      })
      .sort({ deliveryDate: -1 });

    // ✅ 4. Remove null customers
    const filteredOrders = orders.filter((order) => order.customer);

    // ✅ 5. Group orders by customer
    const grouped = filteredOrders.reduce((acc, order) => {
      const customerId = order.customer._id.toString();

      if (!acc[customerId]) {
        acc[customerId] = {
          customer: order.customer,
          orders: [],
          totalOrders: 0,
          totalAmount: 0,
        };
      }

      acc[customerId].orders.push(order);
      acc[customerId].totalOrders += 1;
      acc[customerId].totalAmount += order.orderTotal || 0;

      return acc;
    }, {});

    let groupedOrders = Object.values(grouped);

    //  6. CHECK INVOICE STATUS (FIXED + invoiceId)

    const monthKey = `${yearNum}-${String(monthNum).padStart(2, "0")}`;

    //  Fetch invoices with _id
    const invoices = await Invoice.find({
      month: monthKey,
    }).select("customer _id");

    //  Create lookup map (store invoiceId)
    const invoiceMap = {};
    invoices.forEach((inv) => {
      invoiceMap[inv.customer.toString()] = inv._id; // ✅ store ID
    });

    //  Attach BOTH status + invoiceId
    groupedOrders = groupedOrders.map((item) => ({
      ...item,
      invoiceGenerated: !!invoiceMap[item.customer._id.toString()],
      invoiceId: invoiceMap[item.customer._id.toString()] || null, // ✅ ADD THIS
    }));
    // ✅ 7. Revenue
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.orderTotal || 0),
      0
    );

    // ✅ 8. Response
    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      groupedCount: groupedOrders.length,
      totalRevenue,
      orders: filteredOrders,
      groupedOrders,
    });
  })
);
module.exports = router;

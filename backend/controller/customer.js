const express = require("express");
const router = express.Router();
const Customer = require("../model/customer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create customer endpoint -Admin

router.post(
  "/create-customer",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    let { name, phoneNumber, address, customerType, products } = req.body;

    // 1️⃣ Validation
    if (!name || !phoneNumber || !address) {
      return next(
        new ErrorHandler("Name, phone number and address are required", 400)
      );
    }

    if (!Array.isArray(products) || products.length === 0) {
      return next(new ErrorHandler("At least one product is required", 400));
    }

    name = name.trim();
    phoneNumber = phoneNumber.toString().trim();

    // 2️⃣ Check if customer already exists
    const existingCustomer = await Customer.findOne({ phoneNumber });

    if (existingCustomer) {
      return next(new ErrorHandler("Customer already exists", 400));
    }

    // 3️⃣ Normalize products
    const formattedProducts = products.map((p) => ({
      productName: p.productName,
      quantity: Number(p.quantity),
      price: Number(p.price),
    }));

    // 3️⃣ Create customer
    const customer = await Customer.create({
      name,
      phoneNumber,
      address,
      customerType,
      products: formattedProducts,
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer,
    });
  })
);

// update customer -Admin
router.put(
  "/edit-customer",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { phoneNumber, name, address, customerType, products } = req.body;

    if (!phoneNumber) {
      return next(
        new ErrorHandler("Phone number is required to identify customer", 400)
      );
    }

    // Find customer by phone number
    const customer = await Customer.findOne({ phoneNumber, role: "customer" });

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // Check name uniqueness if you want (optional)
    if (name && name !== customer.name) {
      const existingName = await User.findOne({
        name,
        role: "customer",
        _id: { $ne: customer._id },
      });
      if (existingName) {
        return next(new ErrorHandler("Name already in use", 400));
      }
    }

    // Update fields
    if (name) customer.name = name.trim();
    if (address) customer.address = address;
    if (customerType) customer.customerType = customerType;

    if (Array.isArray(products) && products.length > 0) {
      customer.products = products.map((p) => ({
        productName: p.productName,
        quantity: Number(p.quantity),
        price: Number(p.price),
      }));
    } else {
      console.log("No new products provided, keeping existing ones");
    }

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      customer,
    });
  })
);

// get customer by id (specific customer) -Admin
router.get(
  "/profile",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const customer = await Customer.findById(req.user._id);

    if (!customer || customer.role !== "customer") {
      return next(new ErrorHandler("Customer not found", 404));
    }

    res.status(200).json({
      success: true,
      customer,
    });
  })
);

// Search customer by phoneNumber and name -Admin

router.get(
  "/search-customer",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { phoneNumber, name } = req.query;

    // 1️⃣ Validation
    if (!phoneNumber && !name) {
      return next(new ErrorHandler("Provide phone number or name", 400));
    }

    // 2️⃣ Build query
    const query = {};

    if (phoneNumber) {
      query.phoneNumber = phoneNumber.toString().trim();
    }

    if (name) {
      query.name = { $regex: name.trim(), $options: "i" };
    }

    // 3️⃣ Search customers
    const customers = await Customer.find(query).select(
      "name phoneNumber address products createdAt"
    );

    if (!customers.length) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // 4️⃣ Response
    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  })
);

//get all customers-Admin
router.get(
  "/customers",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res) => {
    const customers = await Customer.find({ role: "customer" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      customers,
    });
  })
);

// Delete customer - Admin
router.delete(
  "/:customerId",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { customerId } = req.params;

    try {
      // Delete directly by ID
      const customer = await Customer.findByIdAndDelete(customerId);

      if (!customer) {
        return next(new ErrorHandler("Customer not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to delete customer", 500));
    }
  })
);

module.exports = router;

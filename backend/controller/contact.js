const express = require("express");
const router = express.Router();
const Contact = require("../model/contact");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create contact endpoint
router.post(
  "/create-contact",
  catchAsyncErrors(async (req, res, next) => {
    let { name, phoneNumber, message } = req.body;

    // 1️⃣ Validation
    if (!name || !phoneNumber || !message) {
      return next(
        new ErrorHandler("Name, phone number and message are required", 400)
      );
    }

    name = name.trim();
    phoneNumber = phoneNumber.toString().trim();

    // 🔹 Phone validation (India basic check)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return next(new ErrorHandler("Invalid phone number", 400));
    }

    // 2️⃣ Prevent spam (same number within last 5 mins)
    const recentContact = await Contact.findOne({
      phoneNumber,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (recentContact) {
      return next(
        new ErrorHandler("You already submitted recently. Please wait.", 429)
      );
    }

    // 3️⃣ Create contact
    const contact = await Contact.create({
      name,
      phoneNumber,
      message,
      status: "new", // 🔹 useful for admin panel
      source: "website", // 🔹 track source
    });

    res.status(201).json({
      success: true,
      message: "Contact request submitted successfully",
      contact,
    });
  })
);

//Get all contacts
router.get(
  "/get-contacts",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts, // ✅ IMPORTANT
    });
  })
);

//Get Single contact
router.get(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorHandler("Contact not found", 404));
    }

    res.status(200).json({
      success: true,
      contact, // ✅ IMPORTANT
    });
  })
);

//Update contact status
router.put(
  "/update-status/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(status)) {
      return next(new ErrorHandler("Invalid status value", 400));
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return next(new ErrorHandler("Contact not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      contact,
    });
  })
);

//Get Delete contact
router.delete(
  "/delete-contact/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorHandler("Contact not found", 404));
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  })
);

module.exports = router;

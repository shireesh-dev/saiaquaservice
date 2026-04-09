const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");

const Invoice = require("../model/invoice");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// 🔥 Get Excel Report (daily / weekly / monthly)
router.get(
  "/download-reports",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { type, date, startDate, endDate, month } = req.query;

    let filter = {};

    if (type === "daily") {
      filter.createdAt = {
        $gte: new Date(date + "T00:00:00"),
        $lte: new Date(date + "T23:59:59"),
      };
    }

    if (type === "weekly") {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type === "monthly") {
      filter.month = month;
    }

    // ✅ Fetch invoices
    const invoices = await Invoice.find(filter)
      .populate("customer", "name phoneNumber")
      .sort({ createdAt: -1 });

    // ✅ Create Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // ✅ Columns
    worksheet.columns = [
      { header: "Invoice No", key: "invoiceNumber", width: 20 },
      { header: "Customer Name", key: "customer", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Product", key: "product", width: 25 },
      { header: "Qty", key: "qty", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Product Total", key: "productTotal", width: 15 },
      { header: "Invoice Total", key: "invoiceTotal", width: 15 },
      { header: "Paid", key: "paid", width: 15 },
      { header: "Due", key: "due", width: 15 },
      { header: "Status", key: "status", width: 12 },
      { header: "Date", key: "date", width: 18 },
    ];

    let grandTotal = 0;
    let totalPaid = 0;
    let totalDue = 0;

    // ✅ Fill Data
    invoices.forEach((inv) => {
      inv.products.forEach((p, index) => {
        worksheet.addRow({
          invoiceNumber: index === 0 ? inv.invoiceNumber : "",
          customer: index === 0 ? inv.customer?.name : "",
          phone: index === 0 ? inv.customer?.phoneNumber : "",
          product: p.productName,
          qty: p.totalQuantity,
          price: p.price,
          productTotal: p.totalAmount,
          invoiceTotal: index === 0 ? inv.total : "",
          paid: index === 0 ? inv.paidAmount : "",
          due: index === 0 ? inv.dueAmount : "",
          status: index === 0 ? inv.status : "",
          date: index === 0 ? new Date(inv.createdAt).toLocaleDateString() : "",
        });
      });

      grandTotal += inv.total;
      totalPaid += inv.paidAmount;
      totalDue += inv.dueAmount;
    });

    // ✅ Summary Row
    worksheet.addRow([]);
    worksheet.addRow({
      product: "TOTAL",
      invoiceTotal: grandTotal,
      paid: totalPaid,
      due: totalDue,
    });

    // ✅ Style
    worksheet.getRow(1).font = { bold: true };

    // ✅ Headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-sales-report.xlsx`
    );

    // ✅ Send file
    await workbook.xlsx.write(res);
    res.end();
  })
);

module.exports = router;

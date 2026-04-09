const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Cookie and form body parsing
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.json()); // JSON parser for all other routes

app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// import routes
const user = require("./controller/user");
const customer = require("./controller/customer");
const jar = require("./controller/jar");
const order = require("./controller/order");
const payment = require("./controller/payment");
const invoice = require("./controller/invoice");
const report = require("./controller/report");

app.use("/api/v2/user", user);
app.use("/api/v2/customer", customer);
app.use("/api/v2/jar", jar);
app.use("/api/v2/order", order);
app.use("/api/v2/payment", payment);
app.use("/api/v2/invoice", invoice);
app.use("/api/v2/report", report);

app.use(express.json());

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;

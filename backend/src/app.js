const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");

// User routes
const authRoute = require("./routes/user-routes/auth.route");
const userRoute = require("./routes/user-routes/user.route");
const tranRoute = require("./routes/user-routes/transaction.route");
const billRoute = require("./routes/user-routes/bill.route");
const cardRoute = require("./routes/user-routes/card.route");
const notificationRoute = require("./routes/user-routes/notification.route");

// Admin routes
const adminAuthRoute = require("./routes/admin-routes/auth.route");
const adminUserRoute = require("./routes/admin-routes/user.route");
const txnsManagementRoute = require("./routes/admin-routes/txsnManagement.route");
const userManagementRoute = require("./routes/admin-routes/userManagement.route");

// Security middlewares
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);

app.use((req, res, next) => {
  if (req.query && typeof req.query === "object") {
    req.query = mongoSanitize.sanitize(req.query);
  }
  if (req.body && typeof req.body === "object") {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
});
app.use((req, res, next) => {
  if (req.query && typeof req.query === "object") {
    req.query = xss.toString(req.query);
  }
  if (req.body && typeof req.body === "object") {
    req.body = xss.toString(req.body);
  }
  next();
});

app.use(hpp());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/transactions", tranRoute);
app.use("/api/bills", billRoute);
app.use("/api/cards", cardRoute);
app.use("/api/notifications", notificationRoute);

app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/admin/users", adminUserRoute);
app.use("/api/admin/transactions", txnsManagementRoute);
app.use("/api/admin/clients", userManagementRoute);

app.use(errorHandler);

module.exports = app;

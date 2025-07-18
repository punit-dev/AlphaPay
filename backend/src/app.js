const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const tranRoute = require("./routes/transaction.route");
const billRoute = require("./routes/bill.route");
const cardRoute = require("./routes/card.route");
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
if (process.env.NODE_ENV !== "test") {
  app.use(mongoSanitize());
  app.use(xss());
}
app.use(hpp());
app.use(
  cors({
    origin: [],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/transactions", tranRoute);
app.use("/bills", billRoute);
app.use("/cards", cardRoute);

app.use(errorHandler);

module.exports = app;

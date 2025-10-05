const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");

const userRoute = require("./routes/user-routes/index");
const adminRoute = require("./routes/admin-routes/index");

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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/users",
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
  userRoute
);
app.use(
  "/api/admin",
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
  adminRoute
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Error handling middleware

app.use(errorHandler);

module.exports = app;

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

connectDB(process.env.MONGOURI);

const errorHandler = require("./middleware/errorHandler");
const authRoute = require("./routes/auth.route");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("this is the test route...");
});

app.use(errorHandler);

module.exports = app;

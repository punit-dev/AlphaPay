const express = require("express");
const route = express.Router();

const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const tranRoute = require("./transaction.route");
const billRoute = require("./bill.route");
const cardRoute = require("./card.route");
const notificationRoute = require("./notification.route");

route.use("/auth", authRoute);
route.use("/users", userRoute);
route.use("/transactions", tranRoute);
route.use("/bills", billRoute);
route.use("/cards", cardRoute);
route.use("/notifications", notificationRoute);

module.exports = route;

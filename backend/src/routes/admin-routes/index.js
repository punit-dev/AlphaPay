const express = require("express");
const route = express.Router();

const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const userManagementRoute = require("./userManagement.route");
const txnsManagementRoute = require("./txnsManagement.route");
const dashboardRoute = require("./dashboard.route");

route.use("/auth", authRoute);
route.use("/users", userRoute);
route.use("/transactions", txnsManagementRoute);
route.use("/clients", userManagementRoute);
route.use("/dashboard", dashboardRoute);

module.exports = route;

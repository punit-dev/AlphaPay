const express = require("express");
const route = express.Router();

const dashboardStatus = require("../../controllers/admin-controllers/dashboard.controller");

const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");

route.use(authMiddleware);

route.get("/", dashboardStatus);

module.exports = route;

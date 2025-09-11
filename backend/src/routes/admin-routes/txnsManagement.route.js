const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");
const txnsManagementValidator = require("../../middleware/admin-middleware/txnsManagementValidator");
const txnsManagementController = require("../../controllers/admin-controllers/txnsManagement.controller");
const checkRole = require("../../middleware/admin-middleware/checkRole");

route.use(authMiddleware);
route.use(checkRole("admin", "superAdmin"));

route.get(
  "/",
  txnsManagementValidator.validateTxnsHistory,
  txnsManagementController.transactionHistory
);

route.put(
  "/refund",
  txnsManagementValidator.validateFund,
  txnsManagementController.refund
);

route.put(
  "/deduct-fund",
  txnsManagementValidator.validateFund,
  txnsManagementController.deductFund
);

module.exports = route;

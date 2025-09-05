const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");
const txsnManagementValidator = require("../../middleware/admin-middleware/txnsManagementValidator");
const txnsManagementController = require("../../controllers/admin-controllers/txnsManagement.controller");

route.get(
  "/",
  authMiddleware,
  txsnManagementValidator.validateTxnsHistory,
  txnsManagementController.transactionHistory
);

route.put(
  "/refund",
  authMiddleware,
  txsnManagementValidator.validateFund,
  txnsManagementController.refund
);

route.put(
  "/deduct-fund",
  authMiddleware,
  txsnManagementValidator.validateFund,
  txnsManagementController.deductFund
);

module.exports = route;

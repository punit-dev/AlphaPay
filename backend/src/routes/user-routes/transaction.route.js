const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/user-middleware/authMiddleware");
const TranController = require("../../controllers/user-controllers/transaction.controller");
const tranValidator = require("../../middleware/user-middleware/transactionValidator");

route.post(
  "/user-to-user",
  tranValidator.userToUserValidator,
  authMiddleware,
  TranController.newUserToUserTransaction
);
route.post(
  "/user-to-bill",
  tranValidator.userToBillValidator,
  authMiddleware,
  TranController.newUserToBillTransaction
);
route.post(
  "/wallet-recharge",
  tranValidator.walletRechargeValidator,
  authMiddleware,
  TranController.walletRecharge
);
route.get(
  "/verify-transaction",
  authMiddleware,
  TranController.verifyTransaction
);
route.get("/all-transaction", authMiddleware, TranController.getTransaction);

module.exports = route;

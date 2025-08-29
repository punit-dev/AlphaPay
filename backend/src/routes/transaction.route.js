const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const TranController = require("../controllers/transaction.controller");
const tranValidator = require("../middleware/transactionValidator");

route.post(
  "/user-to-user",
  tranValidator.userToUserValidator,
  authMiddleware.userAuthMiddleware,
  TranController.newUserToUserTransaction
);
route.post(
  "/user-to-bill",
  tranValidator.userToBillValidator,
  authMiddleware.userAuthMiddleware,
  TranController.newUserToBillTransaction
);
route.post(
  "/wallet-recharge",
  tranValidator.walletRechargeValidator,
  authMiddleware.userAuthMiddleware,
  TranController.walletRecharge
);
route.get(
  "/verify-transaction",
  authMiddleware.userAuthMiddleware,
  TranController.verifyTransaction
);
route.get(
  "/all-transaction",
  authMiddleware.userAuthMiddleware,
  TranController.getTransaction
);

module.exports = route;

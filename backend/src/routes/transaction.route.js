const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const TranController = require("../controllers/transaction.controller");
const tranValidator = require("../middleware/transactionValidator");

route.post(
  "/userToUser",
  tranValidator.userToUserValidator,
  authMiddleware,
  TranController.newUserToUserTransaction
);
route.post(
  "/userToBill",
  tranValidator.userToBillValidator,
  authMiddleware,
  TranController.newUserToBillTransaction
);
route.post(
  "/walletRecharge",
  tranValidator.walletRechargeValidator,
  authMiddleware,
  TranController.walletRecharge
);
route.get(
  "/verifyTransaction",
  authMiddleware,
  TranController.verifyTransaction
);
route.get("/allTransaction", authMiddleware, TranController.getTransaction);

module.exports = route;

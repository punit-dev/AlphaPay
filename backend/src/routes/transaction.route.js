const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const TranController = require("../controllers/transaction.controller");

route.post(
  "/userToUser",
  authMiddleware,
  TranController.newUserToUserTransaction
);
route.post(
  "/userToBill",
  authMiddleware,
  TranController.newUserToBillTransaction
);
route.post("/addBalance", authMiddleware, TranController.addMoneyToWallet);
route.get(
  "/verifyTransaction",
  authMiddleware,
  TranController.verifyTransaction
);
route.get("/allTransaction", authMiddleware, TranController.getTransaction);

module.exports = route;

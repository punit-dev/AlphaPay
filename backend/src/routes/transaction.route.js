const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const TranController = require("../controllers/transaction.controller");

route.post(
  "/userToUser",
  authMiddleware,
  TranController.newUserToUserTransaction
);
route.get("/allTransaction", authMiddleware, TranController.getTransaction);

module.exports = route;

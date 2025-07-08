const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const TranController = require("../controllers/transaction.controller");

route.post("/newTran", authMiddleware, TranController.newTransaction);
route.get("/allTransaction", authMiddleware, TranController.getTransaction);

module.exports = route;

const express = require("express");
const route = express.Router();

const BillController = require("../controllers/bill.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/registerBill", authMiddleware, BillController.registerBill);
route.get("/getBills", authMiddleware, BillController.getBills);
route.put("/updateBill", authMiddleware, BillController.updateBill);
route.delete("/deleteBill", authMiddleware, BillController.deleteBill);

module.exports = route;

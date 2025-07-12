const express = require("express");
const route = express.Router();

const BillController = require("../controllers/bill.controller");
const authMiddleware = require("../middleware/authMiddleware");
const billValidator = require("../middleware/billValidator");

route.post(
  "/registerBill",
  billValidator.registerBillValidator,
  authMiddleware,
  BillController.registerBill
);
route.get("/getBills", authMiddleware, BillController.getBills);
route.put(
  "/updateBill",
  billValidator.updateBillValidator,
  authMiddleware,
  BillController.updateBill
);
route.delete(
  "/deleteBill",
  billValidator.deleteBillValidator,
  authMiddleware,
  BillController.deleteBill
);

module.exports = route;

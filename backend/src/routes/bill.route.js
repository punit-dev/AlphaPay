const express = require("express");
const route = express.Router();

const BillController = require("../controllers/bill.controller");
const authMiddleware = require("../middleware/authMiddleware");
const billValidator = require("../middleware/billValidator");

route.post(
  "/register-bill",
  billValidator.registerBillValidator,
  authMiddleware.userAuthMiddleware,
  BillController.registerBill
);
route.get(
  "/get-bills",
  authMiddleware.userAuthMiddleware,
  BillController.getBills
);
route.put(
  "/update-bill",
  billValidator.updateBillValidator,
  authMiddleware.userAuthMiddleware,
  BillController.updateBill
);
route.delete(
  "/delete-bill",
  billValidator.deleteBillValidator,
  authMiddleware.userAuthMiddleware,
  BillController.deleteBill
);

module.exports = route;

const { body, query } = require("express-validator");

const userToUserValidator = [
  body("payee").notEmpty().withMessage("Payee UPI ID is required"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),
  body("method").isIn(["wallet", "card"]).withMessage("Invalid method"),
  body("pin").notEmpty().withMessage("UPI pin is required"),
];

const userToBillValidator = [
  body("id").notEmpty().withMessage("UId is required"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),
  body("method").isIn(["wallet", "card"]).withMessage("Invalid method"),
  body("pin").notEmpty().withMessage("UPI pin is required"),
  body("validity")
    .isInt({ gt: 0 })
    .withMessage("Validity must be a number greater than 0"),
];

const verifyValidator = [
  query("query").notEmpty().withMessage("Query is required"),
];

const walletRechargeValidator = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),
  body("cardID").notEmpty().withMessage("Card ID is required"),
  body("upiPin").notEmpty().withMessage("UPI pin is required"),
];

module.exports = {
  userToUserValidator,
  userToBillValidator,
  verifyValidator,
  walletRechargeValidator,
};

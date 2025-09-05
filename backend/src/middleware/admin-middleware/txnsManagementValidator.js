const { body, query } = require("express-validator");

exports.validateFund = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("fund")
    .isFloat({ gt: 0 })
    .withMessage("Fund must be a number greater than 0"),
];

exports.validateTxnsHistory = [
  query("userId").optional().isMongoId().withMessage("Invalid user ID"),
  query("transactionId")
    .optional()
    .isMongoId()
    .withMessage("Invalid transaction ID"),
  query("date").optional().isISO8601().withMessage("Invalid date format"),
  query("status")
    .optional()
    .isIn(["pending", "success", "failed"])
    .withMessage("Invalid status"),
  query("method")
    .optional()
    .isIn(["wallet", "card"])
    .withMessage("Invalid transaction type"),
  query("gta")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Invalid greater than amount"),
  query("lta")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Invalid less than amount"),
];

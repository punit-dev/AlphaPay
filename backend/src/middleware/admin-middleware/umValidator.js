const { query } = require("express-validator");

exports.validateGetAllUsers = [
  query("blocked")
    .optional()
    .isBoolean()
    .withMessage("Blocked must be a boolean"),
  query("gtWallet")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Invalid greater than wallet amount"),
  query("ltWallet")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Invalid less than wallet amount"),
  query("lastActive")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Invalid last active days"),
  query("limit").optional().isInt({ gt: 0 }).withMessage("Invalid limit"),
];

exports.validateUserByIdWithTransactions = [
  query("userId").isMongoId().withMessage("Invalid user ID"),
  query("limit").optional().isInt({ gt: 0 }).withMessage("Invalid limit"),
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

exports.validateBlockUnblockUser = [
  query("userId").isMongoId().withMessage("Invalid user ID"),
];

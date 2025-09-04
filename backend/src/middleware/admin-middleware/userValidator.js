const { body, query } = require("express-validator");

exports.validateGetUsers = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("email").optional().isEmail().withMessage("Invalid email format"),
  query("searchTerm")
    .optional()
    .isString()
    .withMessage("Search term must be a string"),
];

exports.validateUpdateProfile = [
  body("fullname")
    .optional()
    .isString()
    .withMessage("Fullname must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
];

exports.validateUpdateRole = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("role")
    .isIn(["user", "admin", "superAdmin"])
    .withMessage("Invalid role"),
];

exports.validateUpdatePass = [
  body("currentPwd").isString().withMessage("Current password is required"),
  body("newPwd")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
];

exports.validateDeleteUser = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
];

const { body, query } = require("express-validator");

exports.validateUpdateUser = [
  body("username")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters"),
  body("fullname")
    .optional()
    .isString()
    .withMessage("Fullname must be a string"),
  body("email").optional().isEmail().withMessage("Must be a valid email"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Valid date is required"),
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
];

exports.validateUpdatePass = [
  body("newPass")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.validateUpdatePin = [
  body("newPin")
    .notEmpty()
    .withMessage("New UPI Pin is required")
    .isLength({ min: 4, max: 6 })
    .withMessage("UPI Pin must be 4 to 6 digits"),
];

exports.validateSearchQuery = [
  query("query")
    .notEmpty()
    .withMessage("Search query is required")
    .isString()
    .withMessage("Search must be a valid string"),
];

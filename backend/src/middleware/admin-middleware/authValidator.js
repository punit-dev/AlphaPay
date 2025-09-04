const { body } = require("express-validator");

exports.validateRegister = [
  body("fullname").notEmpty().withMessage("Fullname is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("role")
    .isIn(["admin", "superAdmin"])
    .withMessage("Valid role is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.validateLogin = [
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const { body, query } = require("express-validator");

const registerCardValidator = [
  body("cardNumber")
    .isLength({ min: 16, max: 16 })
    .withMessage("Card number must be exactly 16 digits")
    .isNumeric()
    .withMessage("Card number must be numeric"),

  body("CVV")
    .isLength({ min: 3, max: 3 })
    .withMessage("CVV must be exactly 3 digits")
    .isNumeric()
    .withMessage("CVV must be numeric"),

  body("expiryDate")
    .notEmpty()
    .withMessage("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
    .withMessage("Expiry date must be in MM/YY format"),

  body("cardHolder")
    .isLength({ min: 2 })
    .withMessage("Card holder name is too short"),

  body("type")
    .isIn(["credit", "debit"])
    .withMessage("Card type must be either 'credit' or 'debit'"),
];

const deleteCardValidator = [
  query("query").notEmpty().withMessage("Card ID query parameter is required"),
];

module.exports = {
  registerCardValidator,
  deleteCardValidator,
};

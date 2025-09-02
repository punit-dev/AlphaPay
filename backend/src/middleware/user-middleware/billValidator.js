const { body, query } = require("express-validator");

const registerBillValidator = [
  body("provider").notEmpty().withMessage("Provider is required"),
  body("UIdType").notEmpty().withMessage("UIdType is required"),
  body("UId").notEmpty().withMessage("UId is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("nickname")
    .optional()
    .isString()
    .withMessage("Nickname must be a string"),
];

const updateBillValidator = [
  query("query").notEmpty().withMessage("Bill UId query is required"),
  body("provider")
    .optional()
    .isString()
    .withMessage("Provider must be a string"),
  body("UId").optional().isString().withMessage("UId must be a string"),
  body("nickname")
    .optional()
    .isString()
    .withMessage("Nickname must be a string"),
];

const deleteBillValidator = [
  query("query").notEmpty().withMessage("Bill UId query is required"),
];

module.exports = {
  registerBillValidator,
  updateBillValidator,
  deleteBillValidator,
};

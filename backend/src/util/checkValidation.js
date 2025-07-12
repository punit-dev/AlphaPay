const { validationResult } = require("express-validator");

const checkValidation = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((err) => err.msg);
    const error = new Error(errors.join(", "));
    error.statusCode = 400;
    throw error;
  }
};

module.exports = checkValidation;

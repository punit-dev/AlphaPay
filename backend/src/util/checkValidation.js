const { validationResult } = require("express-validator");

/**
 * Checks for validation errors in the request using express-validator.
 *
 * @param {Object} req - Express request object.
 * @returns {Error|undefined} - Returns an Error object with all validation messages (comma-separated),
 *                              or undefined if no validation errors exist.
 *
 * Example:
 * // In a route controller
 * const error = checkValidation(req);
 * if (error) {
 *   return res.status(400).json({ message: error.message });
 * }
 */
const checkValidation = (req) => {
  const result = validationResult(req);

  // If validation errors exist, format them into a single Error object
  if (!result.isEmpty()) {
    const errors = result.array().map((err) => err.msg);
    const error = new Error(errors.join(", "));
    return error;
  }
};

module.exports = checkValidation;

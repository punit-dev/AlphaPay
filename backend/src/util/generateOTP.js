const crypto = require("crypto");

/**
 * Generates a numeric One-Time Password (OTP) of given length.
 *
 * @param {number} len - Length of the OTP (default is 6 digits).
 * @returns {string} - Randomly generated numeric OTP.
 *
 * Example:
 * genOTP();      // "493827"
 * genOTP(4);     // "7401"
 */
const genOTP = (len = 6) => {
  let otp = crypto
    .randomInt(Math.pow(10, len - 1), Math.pow(10, len))
    .toString();
  return otp;
};

module.exports = genOTP;

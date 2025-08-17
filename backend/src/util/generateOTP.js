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
  let otp = "";
  for (let i = 0; i < len; i++) {
    otp += Math.floor(Math.random() * 10); // Append a random digit (0–9)
  }
  return otp;
};

module.exports = genOTP;

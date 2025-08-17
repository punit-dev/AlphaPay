const bcrypt = require("bcryptjs");

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @param {string} pass - The plain-text password to hash.
 * @param {number} salt - The number of salt rounds (e.g., 10).
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 *
 * Example:
 * const hashed = await hashPass("mypassword", 10);
 */
const hashPass = async (pass, salt) => {
  const hashedPass = await bcrypt.hash(pass, salt);
  return hashedPass;
};

/**
 * Compares a plain-text password with its hashed version.
 *
 * @param {string} hashedPass - The previously hashed password (stored in DB).
 * @param {string} pass - The plain-text password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 *
 * Example:
 * const isValid = await comparePass(hashed, "mypassword");
 */
const comparePass = async (hashedPass, pass) => {
  const isMatched = await bcrypt.compare(pass, hashedPass);
  return isMatched;
};

module.exports = { hashPass, comparePass };

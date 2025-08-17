const jwt = require("jsonwebtoken");

/**
 * Create a JWT token.
 *
 * @param {Object} data - The payload data to include in the token.
 * @param {string} [time] - Optional expiry time (e.g., "1h", "7d").
 * @returns {string} - The generated JWT token.
 */
const createToken = (data, time) => {
  const token = jwt.sign(
    data,
    process.env.JWT_SECRET, // Secret key from env file
    time && { expiresIn: time } // Add expiry if provided
  );
  return token;
};

/**
 * Verify and decode a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - The decoded payload if valid.
 * @throws {Error} - If verification fails.
 */
const verifyToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    throw new Error("Authentication failed.");
  }
};

module.exports = { createToken, verifyToken };

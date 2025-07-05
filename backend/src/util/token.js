const jwt = require("jsonwebtoken");

const createToken = (data, time) => {
  const token = jwt.sign(
    data,
    process.env.JWT_SECRET,
    time && { expiresIn: time }
  );
  return token;
};

const verifyToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    throw new Error("Authentication failed.");
  }
};

module.exports = { createToken, verifyToken };

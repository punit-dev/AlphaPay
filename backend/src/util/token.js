const jwt = require("jsonwebtoken");

const createToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET);
  return token;
};

const verifyToken = (token) => {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
};

module.exports = { createToken, verifyToken };

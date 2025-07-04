const bcrypt = require("bcryptjs");

const hashPass = async (pass, salt) => {
  const hashedPass = await bcrypt.hash(pass, salt);
  return hashedPass;
};

const comparePass = async (hashedPass, pass) => {
  const isMatched = await bcrypt.compare(pass, hashedPass);
  return isMatched;
};

module.exports = { hashPass, comparePass };

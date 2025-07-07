const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const profile = asyncHandler(async (req, res) => {
  const user = req.user;
  const filteredUser = user.toObject();
  delete filteredUser.password;
  delete filteredUser.__v;
  delete filteredUser.upiPin;
  return res
    .status(200)
    .json({ message: "User Profile Details", user: filteredUser });
});

module.exports = { profile };

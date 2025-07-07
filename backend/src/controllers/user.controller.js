const asyncHandler = require("express-async-handler");
const { comparePass } = require("../util/hash");

const userProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const filteredUser = user.toObject();
  delete filteredUser.password;
  delete filteredUser.__v;
  delete filteredUser.upiPin;
  return res
    .status(200)
    .json({ message: "User Profile Details", user: filteredUser });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const { username, fullname, email, dateOfBirth, phoneNumber } = req.body;
  if (username && username != user.username) {
    user.username = username;
    user.upiId = `${username}@alphapay`;
  }
  if (fullname) user.fullname = fullname;
  if (email && email != user.email) {
    user.email = email;
    user.isVerifiedEmail = false;
  }
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (phoneNumber && phoneNumber != user.phoneNumber) {
    user.phoneNumber = phoneNumber;
    user.isVerifiedPhoneNumber = false;
  }
  await user.save();
  const filteredUser = user.toObject();
  delete filteredUser.password;
  delete filteredUser.__v;
  delete filteredUser.upiPin;
  return res.status(200).json({ message: "User Updated", user: filteredUser });
});

const updatePass = asyncHandler(async (req, res) => {
  const user = req.user;
  const { newPass } = req.body;

  if (!newPass) {
    res.status(400);
    throw new Error("New password is required.");
  }

  if (comparePass(user.password, newPass)) {
    res.status(400);
    throw new Error("This password is already set.");
  }

  user.password = newPass;
  await user.save();

  return res.status(200).json({ message: "Password is successfully updated" });
});

const updateUpiPin = asyncHandler(async (req, res) => {
  const user = req.user;
  const { newUpiPin } = req.body;

  if (!newUpiPin) {
    res.status(400);
    throw new Error("New UPI Pin is required");
  }

  if (comparePass(user.upiPin, newUpiPin)) {
    res.status(400);
    throw new Error("This UPI Pin is already set.");
  }

  user.upiPin = newUpiPin;
  return res.status(200).json({ message: "UPI Pin is successfully updated" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;
  await user.deleteOne();
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "User Deleted Successfully" });
});

module.exports = {
  userProfile,
  updateUser,
  deleteUser,
  updatePass,
  updateUpiPin,
};

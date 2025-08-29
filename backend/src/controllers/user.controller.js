const asyncHandler = require("express-async-handler");
const { comparePass } = require("../util/hash");
const UserModel = require("../models/userModel");
const TransactionModel = require("../models/transactionModel");
const CardModel = require("../models/cardModel");
const BillModel = require("../models/billModel");
const checkValidation = require("../util/checkValidation");
const generateOTP = require("../util/generateOTP");
const { createToken } = require("../util/token");
const mailer = require("../util/mailer");

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile information
 * @access  Privet
 */
const userProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  //remove all sensitive user info
  const filteredUser = user.toObject();
  delete filteredUser.password;
  delete filteredUser.__v;
  delete filteredUser.upiPin;
  delete filteredUser.otpToken;
  return res
    .status(200)
    .json({ message: "User Profile Details", user: filteredUser });
});

/**
 * @route   PUT /api/users/update
 * @desc    Update user profile
 * @access  Privet
 */
const updateUser = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { username, fullname, email, dateOfBirth, phoneNumber } = req.body;

  //check is updated field are available then change if available
  if (username && username != user.username) {
    user.username = username;
    user.upiId = `${username}@alphapay`;
  }
  if (fullname) user.fullname = fullname;
  if (email && email != user.email) {
    user.email = email;
    user.isVerifiedEmail = false;

    const otp = generateOTP(6);
    const token = createToken({ otp }, "10m");
    user.otpToken = token;
    await mailer(email, otp);
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
  delete filteredUser.otpToken;
  return res.status(200).json({ message: "User Updated", user: filteredUser });
});

/**
 * @route   PUT /api/users/updatePass
 * @desc    Update the user login password
 * @access  Privet
 */
const updatePass = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { newPass } = req.body;

  //compare the updated password to current password
  if (await comparePass(user.password, newPass)) {
    res.status(400);
    throw new Error("This password is already set.");
  }

  // assign a plain newPass because it will be hashed before saving
  user.password = newPass;
  await user.save();

  return res.status(200).json({ message: "Password is successfully updated" });
});

/**
 * @route   PUT /api/users/updatePin
 * @desc    Update the user UPI Pin
 * @access  Privet
 */
const updateUpiPin = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { newPin } = req.body;

  if (user.upiPin && (await comparePass(user.upiPin, newPin))) {
    res.status(400);
    throw new Error("This UPI Pin is already set.");
  }

  // assign a plain newPin because it will be hashed before saving
  user.upiPin = newPin;
  await user.save();
  return res.status(200).json({ message: "UPI Pin is successfully updated" });
});

/**
 * @route   DELETE /api/users/delete
 * @desc    Delete user and related data
 * @access  Privet
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;
  await Promise.all([
    user.deleteOne(),
    TransactionModel.deleteMany({
      $or: [{ payee: user._id }, { payer: user._id }],
    }),
    CardModel.deleteMany({
      userID: user._id,
    }),
    BillModel.deleteMany({ userID: user._id }),
  ]);
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "User Deleted Successfully" });
});

/**
 * @route   GET /api/users/search
 * @desc    Search an users using upiID OR phoneNumber
 * @access  Privet
 */
const search = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { query } = req.query;

  const users = await UserModel.find({
    $or: [
      {
        upiId: { $regex: query, $options: "i" },
      },
      {
        phoneNumber: { $regex: query, $options: "i" },
      },
    ],
  }).select("-password -upiPin -__v");

  if (!users.length) {
    res.status(404);
    throw new Error("User not found");
  }

  return res.status(200).json({ users });
});

// Export all controller functions
module.exports = {
  userProfile,
  updateUser,
  deleteUser,
  updatePass,
  updateUpiPin,
  search,
};

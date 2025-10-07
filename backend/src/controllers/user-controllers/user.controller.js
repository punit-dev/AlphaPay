const asyncHandler = require("express-async-handler");
const { comparePass } = require("../../util/hash");
const UserModel = require("../../models/user-models/userModel");
const TransactionModel = require("../../models/user-models/transactionModel");
const CardModel = require("../../models/user-models/cardModel");
const BillModel = require("../../models/user-models/billModel");
const checkValidation = require("../../util/checkValidation");
const generateOTP = require("../../util/generateOTP");
const { createToken } = require("../../util/token");
const mailer = require("../../util/mailer");

/**
 * @route   GET /api/clients/users/profile
 * @desc    Get user profile information
 * @access  Privet
 */
const userProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({ message: "User Profile Details", user });
});

/**
 * @route   PUT /api/clients/users/update
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
    const isExist = await UserModel.findOne({ username });
    if (isExist) {
      res.status(400);
      throw new Error("Username already in use.");
    }
    user.username = username;
    user.upiId = `${username}@alphapay`;
  }
  if (fullname) user.fullname = fullname;
  if (email && email != user.email) {
    const isExist = await UserModel.findOne({ email });
    if (isExist) {
      res.status(400);
      throw new Error("Email already in use.");
    }
    user.email = email;
    user.isVerifiedEmail = false;

    const otp = generateOTP(6);
    const token = createToken({ otp }, "10m");
    user.otpToken = token;
    if (process.env.NODE_ENV !== "production") {
      await mailer.sendOTP(email, otp);
    }
  }
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (phoneNumber && phoneNumber != user.phoneNumber) {
    user.phoneNumber = phoneNumber;
    user.isVerifiedPhoneNumber = false;
  }
  await user.save();

  return res.status(200).json({ message: "User Updated", user, otp: otp });
});

/**
 * @route   PUT /api/clients/users/update-pass
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
    throw new Error("New password must be different from the old password.");
  }

  // assign a plain newPass because it will be hashed before saving
  user.password = newPass;
  await user.save();

  return res.status(200).json({ message: "Password is successfully updated" });
});

/**
 * @route   PUT /api/clients/users/update-pin
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
    throw new Error("New UPI pin must be different from the old pin.");
  }

  // assign a plain newPin because it will be hashed before saving
  user.upiPin = newPin;
  await user.save();
  return res.status(200).json({ message: "UPI Pin is successfully updated" });
});

/**
 * @route   DELETE /api/clients/users/delete
 * @desc    Delete user and related data
 * @access  Privet
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;
  await Promise.all([
    user.deleteOne(),
    TransactionModel.deleteMany({
      $or: [{ "payee.userRef": user._id }, { "payer.userRef": user._id }],
    }),
    CardModel.deleteMany({
      userId: user._id,
    }),
    BillModel.deleteMany({ userId: user._id }),
  ]);
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "User Deleted Successfully" });
});

/**
 * @route   GET /api/clients/users/search?query=
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

  if (users.length == 0) {
    res.status(404);
    throw new Error("User not found");
  }

  return res.status(200).json({
    message: "Search Results",
    results: users,
  });
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

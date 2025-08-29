//Imports
const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateOTP = require("../util/generateOTP");
const mailer = require("../util/mailer");
const { createToken, verifyToken } = require("../util/token");
const { comparePass } = require("../util/hash");
const checkValidation = require("../util/checkValidation");

/**
 * @route   POST /api/auth/register
 * @desc    Registers a new user and sends OTP for email verification
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { username, fullname, password, email, phoneNumber, dateOfBirth } =
    req.body;

  const isUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUser) {
    res.status(400);
    throw new Error("User already exist");
  }

  // Generate a random initial wallet balance
  const walletBalance = Math.floor(Math.random() * 10000);

  // Generate OTP and token (valid for 10 minutes)
  const otp = generateOTP(6);
  const token = createToken({ otp }, "10m");

  const newUser = await UserModel.create({
    username,
    fullname,
    password,
    email,
    phoneNumber,
    dateOfBirth,
    walletBalance,
    otpToken: token,
  });

  // Send OTP to user's email
  await mailer(newUser.email, otp);

  const filteredUser = newUser.toObject();
  delete filteredUser.__v;
  delete filteredUser.password;
  delete filteredUser.upiPin;
  delete filteredUser.otpToken;

  // Create auth token after registration
  const authToken = createToken({ userID: newUser._id });
  res.cookie("token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(201).json({
    message: "User created successfully",
    user: filteredUser,
    authToken,
    otp: `${process.env.NODE_ENV === "test" && otp}`,
  });
});

/**
 * @route   POST /api/auth/verifyOtp
 * @desc    Verifies the OTP and activates the user's email
 * @access  Public
 */
const verifyOTP = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { otp, email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Decode and verify the OTP token
  let verify;
  try {
    verify = verifyToken(user.otpToken);
  } catch (err) {
    res.status(401);
    throw new Error("OTP expired or invalid. Please request a new one.");
  }

  if (otp != verify.otp) {
    return res
      .status(401)
      .json({ message: "OTP is invalid please try again." });
  }

  user.otpToken = null;
  user.isVerifiedEmail = true;
  await user.save();
  return res.status(200).json({ message: "OTP Successfully verified" });
});

/**
 * @route   POST /api/auth/resendOtp
 * @desc    Re-sends a new OTP to the user's email
 * @access  Public
 */
const resendOTP = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { email } = req.body;

  // Generate new OTP and token
  const otp = generateOTP(6);
  const token = createToken({ otp }, "10m");

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await mailer(email, otp);

  // Save the new OTP token in DB
  user.otpToken = token;
  await user.save();
  return res.status(200).json({
    message: "OTP sent successfully",
    otp: `${process.env.NODE_ENV === "test" && otp}`,
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Logs in the user using email/username and password
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { data, password } = req.body;

  const isUser = await UserModel.findOne({
    $or: [{ email: data }, { username: data }],
  });
  if (!isUser) {
    res.status(404);
    throw new Error("Incorrect username and password");
  }

  // Make sure email is verified
  if (!isUser.isVerifiedEmail && process.env.NODE_ENV === "production") {
    res.status(400);
    throw new Error("First verify you email.");
  }

  const isMatched = await comparePass(isUser.password, password);
  if (!isMatched) {
    res.status(404);
    throw new Error("Incorrect username and password");
  }

  const filteredUser = isUser.toObject();
  delete filteredUser.__v;
  delete filteredUser.password;
  delete filteredUser.upiPin;

  // Create and send auth token
  const token = createToken({ userID: isUser._id });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "User logged in successfully",
    token,
    user: filteredUser,
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logs the user out by clearing the cookie
 * @access  Privet
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logout successfully" });
});

// Export all controller functions
module.exports = { register, verifyOTP, resendOTP, login, logout };

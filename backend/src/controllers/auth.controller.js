const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateOTP = require("../util/generateOTP");
const mailer = require("../util/mailer");
const { createToken, verifyToken } = require("../util/token");
const { comparePass } = require("../util/hash");
const checkValidation = require("../util/checkValidation");

const sendOTP = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const userEmail = req.body.email;
  if (!userEmail) {
    res.status(400);
    throw new Error("User email is required.");
  }

  const otp = generateOTP(6);

  const token = createToken({ otp }, "10m");
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000,
  });

  await mailer(userEmail, `this is you OTP: ${otp}`);

  return res.status(200).json({
    message: "OTP successfully sent",
    token,
    otp: `${process.env.NODE_ENV === "test" && otp}`,
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { otp, token } = req.body;

  if (!otp) {
    res.status(400);
    throw new Error("otp is required.");
  }

  const authToken = req.cookies.authToken || token;

  let verify;
  try {
    verify = verifyToken(authToken);
  } catch (err) {
    res.status(401);
    throw new Error("OTP expired or invalid. Please request a new one.");
  }

  if (otp != verify.otp) {
    return res
      .status(401)
      .json({ message: "OTP is invalid please try again." });
  }

  res.clearCookie("authToken");
  return res.status(200).json({ message: "OTP Successfully verified" });
});

const register = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const {
    username,
    fullname,
    password,
    email,
    phoneNumber,
    upiPin,
    dateOfBirth,
  } = req.body;

  const isUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUser) {
    res.status(400);
    throw new Error("User already exist");
  }

  const walletBalance = Math.floor(Math.random() * 10000);

  const newUser = await UserModel.create({
    username,
    fullname,
    password,
    email,
    phoneNumber,
    upiPin,
    dateOfBirth,
    walletBalance,
    isVerifiedEmail: true,
  });

  const filteredUser = newUser.toObject();
  delete filteredUser.__v;
  delete filteredUser.password;
  delete filteredUser.upiPin;

  const token = createToken({ userID: newUser._id });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res
    .status(201)
    .json({ message: "User created successfully", token, user: filteredUser });
});

const login = asyncHandler(async (req, res) => {
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

  const isMatched = await comparePass(isUser.password, password);
  if (!isMatched) {
    res.status(404);
    throw new Error("Incorrect username and password");
  }

  const filteredUser = isUser.toObject();
  delete filteredUser.__v;
  delete filteredUser.password;
  delete filteredUser.upiPin;

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

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Log out successfully" });
});

module.exports = { sendOTP, verifyOTP, register, login, logout };

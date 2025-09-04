const AdminUserModel = require("../../models/admin-models/userModel");

const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const { createToken } = require("../../util/token");
const { comparePass } = require("../../util/hash");

/**
 * @route POST /api/admin/auth/register
 * @desc Register a new user
 * @access Private (superAdmin)
 */
const register = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role != "superAdmin") {
    res.status(403);
    throw new Error("Only super admins can register new users");
  }

  const isNotValid = validation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { fullname, email, password, role } = req.body;

  const isUserExists = await AdminUserModel.findOne({ email });
  if (isUserExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = await AdminUserModel.create({
    fullname,
    email,
    password,
    role,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});

/**
 * @route POST /api/admin/auth/login
 * @desc Login a user
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { email, password } = req.body;

  const user = await AdminUserModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatched = await comparePass(user.password, password);
  if (!isMatched) {
    res.status(401);
    throw new Error("Incorrect email and password");
  }

  const token = createToken({ userId: user._id }, "7d");
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  user.lastLogin = Date.now();
  await user.save();

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @route POST /api/admin/auth/logout
 * @desc Logout a user
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "User logged out successfully" });
});

module.exports = {
  register,
  login,
  logout,
};

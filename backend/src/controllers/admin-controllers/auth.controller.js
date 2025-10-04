const AdminUserModel = require("../../models/admin-models/userModel");

const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const { createToken } = require("../../util/token");
const { comparePass } = require("../../util/hash");

/**
 * @route POST /api/admin/auth/register
 * @desc Register a new admin
 * @access Private (superAdmin)
 */
const register = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { fullname, email, password, role } = req.body;

  const isAdminExists = await AdminUserModel.findOne({ email });
  if (isAdminExists) {
    res.status(400);
    throw new Error("Email already in use.");
  }

  const newAdmin = await AdminUserModel.create({
    fullname,
    email,
    password,
    role,
  });

  res.status(201).json({
    message: "Admin registered successfully",
    admin: newAdmin,
  });
});

/**
 * @route POST /api/admin/auth/login
 * @desc Login a admin
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { email, password } = req.body;

  const admin = await AdminUserModel.findOne({ email });
  if (!admin) {
    res.status(401);
    throw new Error("Incorrect email and password");
  }

  const isMatched = await comparePass(admin.password, password);
  if (!isMatched) {
    res.status(401);
    throw new Error("Incorrect email and password");
  }

  const token = createToken({ userId: admin._id }, "7d");
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  admin.lastLogin = Date.now();
  await admin.save();

  res.status(200).json({
    message: "Login successfully",
    admin: {
      id: admin._id,
      fullname: admin.fullname,
      email: admin.email,
      role: admin.role,
    },
  });
});

/**
 * @route POST /api/admin/auth/logout
 * @desc Logout a admin
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout successfully" });
});

module.exports = {
  register,
  login,
  logout,
};

const AdminUserModel = require("../../models/admin-models/userModel");

const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const { comparePass } = require("../../util/hash");

/**
 * @route GET /api/admin/users?page=&limit=&email=&searchTerm=
 * @desc Get all users
 * @access Private (superAdmin)
 */
const getUsers = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }
  const isNotValid = validation(req.query);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { page, limit, email, searchTerm } = req.query;

  const filter = {};

  if (email) {
    filter.email = { $regex: email, $options: "i" };
  }

  if (searchTerm) {
    filter.$or = [
      { fullname: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { _id: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const users = await AdminUserModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
  return res
    .status(200)
    .json({ message: "Users retrieved successfully", users });
});

/**
 * @route GET /api/admin/users/profile
 * @desc Get user profile
 * @access Private
 */
const profile = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json({ message: "User profile retrieved successfully", user });
});

/**
 * @route PUT /api/admin/users/update
 * @desc Update user profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { fullname, email } = req.body;

  const updatedUser = await AdminUserModel.findByIdAndUpdate(
    user._id,
    { fullname, email },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "User profile updated successfully", user: updatedUser });
});

/**
 * @route PUT /api/admin/users/update-role
 * @desc Update user role
 * @access Private (superAdmin)
 */
const updateRole = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  if (user.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const { userId, role } = req.body;

  const updatedUser = await AdminUserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "User role updated successfully", user: updatedUser });
});

/**
 * @route PUT /api/admin/users/update-password
 * @desc Update user password
 * @access Private
 */
const updatePass = asyncHandler(async (req, res) => {
  const user = req.user;

  const { currentPwd, newPwd } = req.body;

  const isMatch = await comparePass(user.password, currentPwd);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPwd;
  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
});

/**
 * @route DELETE /api/admin/users/delete?userId=
 * @desc Delete user
 * @access Private (superAdmin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const { userId } = req.query;

  const deletedUser = await AdminUserModel.findByIdAndDelete(userId);
  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  return res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  getUsers,
  profile,
  updateProfile,
  updateRole,
  updatePass,
  deleteUser,
};

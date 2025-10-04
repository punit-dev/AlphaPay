const AdminUserModel = require("../../models/admin-models/userModel");

const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const { comparePass } = require("../../util/hash");

/**
 * @route GET /api/admin?page=&limit=&email=&searchTerm=
 * @desc Get all admins
 * @access Private (superAdmin)
 */
const getUsers = asyncHandler(async (req, res) => {
  const isNotValid = validation(req.query);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { limit, email, role, page } = req.query;

  const filter = {};

  if (email) {
    filter.email = email;
  }

  if (role) {
    filter.role = role;
  }

  const skip = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 10);

  const admins = await AdminUserModel.find(filter)
    .skip(skip)
    .limit(parseInt(limit) || 10)
    .sort({ createdAt: -1 });
  const total = await AdminUserModel.countDocuments(filter);

  return res.status(200).json({
    message: "Admin Users List",
    admins: admins,
    pagination: {
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limit),
      next: page < Math.ceil(total / limit) ? parseInt(page) + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  });
});

/**
 * @route GET /api/admin/profile
 * @desc Get admin profile
 * @access Private
 */
const profile = asyncHandler(async (req, res) => {
  const admin = req.admin;
  return res
    .status(200)
    .json({ message: "Admin profile retrieved successfully", admin });
});

/**
 * @route PUT /api/admin/update-role
 * @desc Update admin role
 * @access Private (superAdmin)
 */
const updateRole = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { adminId, role } = req.body;

  if (req.admin._id == adminId) {
    res.status(400);
    throw new Error("You cannot change your own role");
  }

  const updatedAdmin = await AdminUserModel.findByIdAndUpdate(
    adminId,
    { role },
    { new: true }
  );

  if (!updatedAdmin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  return res
    .status(200)
    .json({ message: "Admin role updated successfully", admin: updatedAdmin });
});

/**
 * @route PUT /api/admin/update-password
 * @desc Update admin password
 * @access Private
 */
const updatePass = asyncHandler(async (req, res) => {
  const admin = req.admin;

  const { currentPwd, newPwd } = req.body;

  const isMatch = await comparePass(admin.password, currentPwd);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  if (currentPwd === newPwd) {
    res.status(400);
    throw new Error(
      "New password must be different from the current password."
    );
  }

  admin.password = newPwd;
  await admin.save();

  return res.status(200).json({ message: "Password updated successfully" });
});

/**
 * @route DELETE /api/admin/delete?adminId=
 * @desc Delete admin
 * @access Private (superAdmin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { adminId } = req.query;

  if (req.admin._id == adminId) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  const deletedUser = await AdminUserModel.findByIdAndDelete(adminId);
  if (!deletedUser) {
    res.status(404);
    throw new Error("Admin not found");
  }

  return res
    .status(200)
    .json({ message: "Admin user deleted successfully", admin: deletedUser });
});

module.exports = {
  getUsers,
  profile,
  updateRole,
  updatePass,
  deleteUser,
};

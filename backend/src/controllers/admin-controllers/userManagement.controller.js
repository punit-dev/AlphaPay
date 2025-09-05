const UserModel = require("../../models/user-models/userModel");
const TransactionModel = require("../../models/user-models/transactionModel");
const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const moment = require("moment");

/**
 * @route GET /api/admin/clients?blocked=&gtWallet=&ltWallet=&lastActive=&limit=
 * @desc Get all users with filters
 * @access Admin, SuperAdmin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "admin" && user.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { blocked, gtWallet, ltWallet, lastActive, limit } = req.query;

  const filter = {};

  if (blocked != undefined) {
    filter.isBlocked = blocked == "true";
  }

  if (lastActive != undefined) {
    const cutoff = moment().subtract(lastActive, "days").toDate();
    filter.lastActiveAt = { $lte: cutoff };
  }

  if (gtWallet != undefined) {
    filter.walletBalance = {
      ...filter.walletBalance,
      $gte: parseInt(gtWallet),
    };
  }
  if (ltWallet != undefined) {
    filter.walletBalance = {
      ...filter.walletBalance,
      $lte: parseInt(ltWallet),
    };
  }

  const users = await UserModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit || 50);
  res.status(200).json(users);
});

/**
 * @route GET /api/admin/clients/transactions?userId=&limit=&status=&method=&gta=&lta=
 * @desc Get user by ID with transaction filters
 * @access Admin, SuperAdmin
 */
const getUserByIdWithTransactions = asyncHandler(async (req, res) => {
  const adm = req.user;
  if (adm.role != "admin" && adm.role != "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, limit, status, method, gta, lta } = req.query;

  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const filter = {
    $or: [{ "payee.userRef": userId }, { "payer.userRef": userId }],
  };

  if (status != undefined) {
    filter.status = status.toUpperCase();
  }

  if (method != undefined) {
    filter.method = { type: method.toLowerCase() };
  }

  if (gta != undefined) {
    filter.amount = { ...filter.amount, $gte: parseFloat(gta) };
  }

  if (lta != undefined) {
    filter.amount = { ...filter.amount, $lte: parseFloat(lta) };
  }

  console.log(filter);

  const transactions = await TransactionModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit || 50);
  res.status(200).json({ user, transactions });
});

/**
 * @route PUT /api/admin/clients/block?userId=
 * @desc Block a user
 * @access Admin, SuperAdmin
 */
const blockUser = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const adm = req.user;
  if (adm.role !== "admin" && adm.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const { userId } = req.query;

  const user = await UserModel.findByIdAndUpdate(userId, { isBlocked: true });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  return res
    .status(200)
    .json({ message: "User blocked Successfully", updatedUser: user });
});

/**
 * @route PUT /api/admin/clients/unblock?userId=
 * @desc Unblock a user
 * @access Admin, SuperAdmin
 */
const unblockUser = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const adm = req.user;
  if (adm.role !== "admin" && adm.role != "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const { userId } = req.query;

  const user = await UserModel.findByIdAndUpdate(userId, { isBlocked: false });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  return res
    .status(200)
    .json({ message: "User blocked Successfully", updatedUser: user });
});

module.exports = {
  getAllUsers,
  getUserByIdWithTransactions,
  blockUser,
  unblockUser,
};

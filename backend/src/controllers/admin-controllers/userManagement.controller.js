const UserModel = require("../../models/user-models/userModel");
const TransactionModel = require("../../models/user-models/transactionModel");
const NotificationModel = require("../../models/user-models/notificationModel");
const BillModel = require("../../models/user-models/billModel");
const CardModel = require("../../models/user-models/cardModel");
const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const moment = require("moment");

/**
 * @route GET /api/admin/users?blocked=&gtWallet=&ltWallet=&lastActive=&limit=&page=
 * @desc Get all users with filters
 * @access Admin, SuperAdmin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { blocked, gtWallet, ltWallet, lastActive, limit, page } = req.query;

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

  const skip = ((parseInt(page) || 1) - 1) * limit;

  const users = await UserModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) || 50)
    .skip(skip);
  const total = await UserModel.countDocuments(filter);

  res.status(200).json({
    message: "Users List",
    users,
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
 * @route GET /api/admin/users/transactions?userId=&limit=&status=&method=&gta=&lta=
 * @desc Get user by ID with transaction filters
 * @access Admin, SuperAdmin
 */
const getUserByIdWithTransactions = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, limit, status, method, gta, lta, page } = req.query;

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
    filter["method.type"] = method.toLowerCase();
  }

  if (gta != undefined) {
    filter.amount = { ...filter.amount, $gte: parseFloat(gta) };
  }

  if (lta != undefined) {
    filter.amount = { ...filter.amount, $lte: parseFloat(lta) };
  }

  const skip = ((parseInt(page) || 1) - 1) * limit;

  const transactions = await TransactionModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) || 50)
    .skip(skip);
  const total = await TransactionModel.countDocuments(filter);

  if (!transactions) {
    res.status(404);
    throw new Error("Transactions not found for this user");
  }
  res.status(200).json({
    message: "User transactions",
    user,
    transactions,
    txnsPagination: {
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limit),
      next: page < Math.ceil(total / limit) ? parseInt(page) + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  });
});

/**
 * @route PUT /api/admin/users/block?userId=
 * @desc Block a user
 * @access Admin, SuperAdmin
 */
const blockUser = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId } = req.query;

  const user = await UserModel.findByIdAndUpdate(userId, { isBlocked: true });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  return res.status(200).json({ message: "User blocked Successfully", user });
});

/**
 * @route PUT /api/admin/users/unblock?userId=
 * @desc Unblock a user
 * @access Admin, SuperAdmin
 */
const unblockUser = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId } = req.query;

  const user = await UserModel.findByIdAndUpdate(userId, { isBlocked: false });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  return res.status(200).json({ message: "User unblocked Successfully", user });
});

/**
 * @route DELETE /api/admin/users/delete?userId=
 * @desc Delete a user and all associated data
 * @access Admin, SuperAdmin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const userId = req.query.userId;

  const deletedUser = await UserModel.findByIdAndDelete(userId);
  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  await Promise.all([
    TransactionModel.deleteMany({
      $or: [{ "payer.userRef": userId }, { "payee.userRef": userId }],
    }),
    NotificationModel.deleteMany({ userId }),
    CardModel.deleteMany({ userId }),
    BillModel.deleteMany({ userId }),
  ]);

  return res
    .status(200)
    .json({ message: "User delete successfully", userId: deletedUser._id });
});

module.exports = {
  getAllUsers,
  getUserByIdWithTransactions,
  blockUser,
  unblockUser,
  deleteUser,
};

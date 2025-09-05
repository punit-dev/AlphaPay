const UserModel = require("../../models/user-models/userModel");
const NotificationModel = require("../../models/user-models/notificationModel");
const TransactionModel = require("../../models/user-models/transactionModel");
const asyncHandler = require("express-async-handler");
const validation = require("../../util/checkValidation");
const { sendData } = require("../../util/sockets");
const moment = require("moment");

/**
 * @route GET /api/admin/transactions?userId=&transactionId=&days=&status=&type=&gta=&lta=
 * @desc Get all transaction history
 * @access Admin, SuperAdmin
 */
const transactionHistory = asyncHandler(async (req, res) => {
  const adm = req.user;
  if (adm.role !== "admin" && adm.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, transactionId, days, status, method, gta, lta } = req.query;

  const filter = {};
  if (userId != undefined) {
    filter.$or = [{ "payee.userRef": userId }, { "payer.userRef": userId }];
  }
  if (transactionId != undefined) {
    filter._id = transactionId;
  }
  if (days != undefined) {
    const cutoff = moment().subtract(days, "days").toDate();
    filter.createdAt = { $gte: cutoff, $lte: new Date() };
  }
  if (status != undefined) {
    filter.status = status.toUpperCase();
  }
  if (method != undefined) {
    filter["method.type"] = method.toLowerCase();
  }
  if (gta != undefined) {
    filter.amount = { ...filter.amount, $gte: parseInt(gta) };
  }
  if (lta != undefined) {
    filter.amount = { ...filter.amount, $lte: parseInt(lta) };
  }

  const transactions = await TransactionModel.find(filter)
    .populate([
      { path: "payee.userRef", select: "upiId fullname" },
      { path: "payer.userRef", select: "upiId fullname" },
    ])
    .sort({ createdAt: -1 })
    .limit(50);

  if (!transactions) {
    res.status(404);
    throw new Error("Transaction not found.");
  }

  return res
    .status(200)
    .json({ message: "All Wallet transaction history", transactions });
});

/**
 * @route PUT /api/admin/transactions/refund
 * @desc refund amount to user wallet
 * @access Admin, SuperAdmin
 */
const refund = asyncHandler(async (req, res) => {
  const adm = req.user;
  if (adm.role !== "admin" && adm.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, fund } = req.body;

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.walletBalance += fund;
  await user.save();

  const notify = await NotificationModel.create({
    userId: user._id,
    action: "credit",
    balance: user.walletBalance,
    type: "transaction",
    message: `You refunded ₹${fund} to your wallet`,
  });

  sendData(user.socketId, "tran", notify);

  return res.status(200).json({
    message: "refund successfully",
  });
});

/**
 * @route PUT /api/admin/transactions/deduct-fund
 * @desc Deduct fund from user wallet
 * @access Admin, SuperAdmin
 */
const deductFund = asyncHandler(async (req, res) => {
  const adm = req.user;
  if (adm.role !== "admin" && adm.role !== "superAdmin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, fund } = req.body;

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.walletBalance -= fund;
  await user.save();

  const notify = await NotificationModel.create({
    userId: user._id,
    action: "debit",
    balance: user.walletBalance,
    type: "transaction",
    message: `You debited ₹${fund} from your wallet`,
  });

  sendData(user.socketId, "tran", notify);

  return res.status(200).json({
    message: "Fund deducted successfully",
  });
});

module.exports = {
  refund,
  deductFund,
  transactionHistory,
};

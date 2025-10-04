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
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, transactionId, days, status, method, gta, lta, page, limit } =
    req.query;

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

  const skip = ((parseInt(page) || 1) - 1) * limit;

  const transactions = await TransactionModel.find(filter)
    .populate([
      { path: "payee.userRef", select: "upiId fullname" },
      { path: "payer.userRef", select: "upiId fullname" },
    ])
    .sort({ createdAt: -1 })
    .limit(parseInt(limit) || 50)
    .skip(skip);

  const total = await TransactionModel.countDocuments(filter);

  if (!transactions) {
    res.status(404);
    throw new Error("Transaction not found.");
  }

  return res.status(200).json({
    message: "Transactions List",
    transactions,
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
 * @route PUT /api/admin/transactions/refund
 * @desc refund amount to user wallet
 * @access Admin, SuperAdmin
 */
const refund = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, transactionId, reason } = req.body;

  const transaction = await TransactionModel.findById(transactionId);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (transaction.payee.userRef.toString() !== userId) {
    res.status(400);
    throw new Error("This transaction does not belong to the specified user");
  }
  if (transaction.status !== "SUCCESS") {
    res.status(400);
    throw new Error("Only successful transactions can be refunded");
  }
  if (transaction.category === "REFUND") {
    res.status(400);
    throw new Error("Refund transaction cannot be refunded again");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!reason || reason.trim().split(" ").length < 5) {
    res.status(400);
    throw new Error("Please provide a valid reason (at least 5 words)");
  }

  user.walletBalance += transaction.amount;
  await user.save();

  const refundTransaction = await TransactionModel.create({
    initiatedBy: "ADMIN",
    amount: transaction.amount,
    category: "REFUND",
    payee: {
      name: user.fullname,
      type: "wallet",
      userRef: user._id,
      accountOrPhone: user.phoneNumber,
      transactionType: "CREDIT",
    },
    status: "SUCCESS",
    message: reason,
  });

  const notify = await NotificationModel.create({
    userId: user._id,
    action: "credit",
    balance: user.walletBalance,
    data: refundTransaction,
    type: "transaction",
    message: `₹${refundTransaction.amount} was refunded to your wallet`,
  });

  sendData(user.socketId, "tran", notify);

  return res.status(200).json({
    message: "Transaction refunded successfully",
    transaction: refundTransaction,
  });
});

/**
 * @route PUT /api/admin/transactions/deduct
 * @desc Deduct fund from user wallet
 * @access Admin, SuperAdmin
 */
const deductFund = asyncHandler(async (req, res) => {
  const isNotValid = validation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { userId, fund, reason } = req.body;

  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.walletBalance <= 0) {
    res.status(400);
    throw new Error("User has insufficient balance");
  }

  if (fund <= 0) {
    res.status(400);
    throw new Error("Deduction amount must be greater than zero");
  }

  if (!reason || reason.trim().split(" ").length < 5) {
    res.status(400);
    throw new Error("Please provide a valid reason (at least 5 words)");
  }

  const actualDeduct = Math.min(fund, user.walletBalance);
  user.walletBalance -= actualDeduct;
  await user.save();

  const transaction = await TransactionModel.create({
    initiatedBy: "ADMIN",
    amount: actualDeduct,
    category: "DEDUCTION",
    payee: {
      name: user.fullname,
      type: "wallet",
      userRef: user._id,
      accountOrPhone: user.phoneNumber,
      transactionType: "DEBIT",
    },
    status: "SUCCESS",
    message: reason,
  });

  const notify = await NotificationModel.create({
    userId: user._id,
    action: "debit",
    balance: user.walletBalance,
    data: transaction,
    type: "transaction",
    message: `₹${actualDeduct} was debited from your wallet`,
  });

  sendData(user.socketId, "tran", notify);

  return res.status(200).json({
    message: "Fund deducted successfully",
    transaction,
  });
});

module.exports = {
  refund,
  deductFund,
  transactionHistory,
};

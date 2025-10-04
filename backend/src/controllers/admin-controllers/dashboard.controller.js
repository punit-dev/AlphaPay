const UserModel = require("../../models/user-models/userModel");
const TransactionModel = require("../../models/user-models/transactionModel");

const asyncHandler = require("express-async-handler");

/**
 * @route GET /api/admin/dashboard
 * @desc Get dashboard statistics
 * @access Private
 */

const dashboardStatus = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [totalUsers, activeUsers] = await Promise.all([
    UserModel.countDocuments(),
    TransactionModel.distinct("payer.userRef", {
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).then((users) => users.length),
  ]);

  const [
    totalTransactions,
    successTransactions,
    failedTransactions,
    refundTransactions,
    deductionTransaction,
    revenueAgg,
    topUsers,
  ] = await Promise.all([
    TransactionModel.countDocuments(),
    TransactionModel.countDocuments({ status: "SUCCESS" }),
    TransactionModel.countDocuments({ status: "FAILED" }),
    TransactionModel.countDocuments({ category: "REFUND" }),
    TransactionModel.countDocuments({ category: "DEDUCTION" }),

    TransactionModel.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          avgValue: { $avg: "$amount" },
        },
      },
    ]),
    TransactionModel.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: "$payer.userRef",
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          upiId: "$userDetails.upiId",
          totalSpent: 1,
          transactionCount: 1,
        },
      },
    ]),
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
  const avgTransactionValue = revenueAgg[0]?.avgValue || 0;
  const transactionSuccessRatio = totalTransactions
    ? ((successTransactions / totalTransactions) * 100).toFixed(1)
    : 0;

  res.json({
    message: "Dashboard Statistics",
    statistics: {
      totalUsers,
      activeUsers,
      totalTransactions,
      successTransactions,
      failedTransactions,
      refundTransactions,
      deductionTransaction,
      totalRevenue,
      avgTransactionValue,
      transactionSuccessRatio: transactionSuccessRatio + "%",
      topUsers,
    },
  });
});

module.exports = dashboardStatus;

const TransactionModel = require("../models/transactionModel");
const UserModel = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const { comparePass } = require("../util/hash");

const newUserToUserTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const { payee, amount, pin, method, message } = req.body;

  const isPayee = await UserModel.findOne({ upiId: payee });
  if (!isPayee) {
    res.status(404);
    throw new Error("Payee not found");
  }

  if (amount <= 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero.");
  }
  if (amount > user.walletBalance) {
    res.status(400);
    throw new Error("Your wallet balance is too low.");
  }

  if (!(await comparePass(user.upiPin, pin))) {
    const failedTran = await TransactionModel.create({
      payer: user._id,
      payee: {
        name: isPayee.fullname,
        type: "user",
        userRef: isPayee._id,
        accountOrPhone: isPayee.phoneNumber,
      },
      amount: amount,
      method: method,
      status: "FAILED",
      message: "Incorrect UPI Pin",
    });

    res.status(400);
    throw new Error("Transaction failed. Please check details and try again.");
  }

  const successTran = await TransactionModel.create({
    payer: user._id,
    payee: {
      name: isPayee.fullname,
      type: "user",
      userRef: isPayee._id,
      accountOrPhone: isPayee.phoneNumber,
    },
    amount: amount,
    method: method,
    status: "SUCCESS",
    message: message || "Paid",
  });

  user.walletBalance -= amount;
  isPayee.walletBalance += amount;

  await Promise.all([user.save(), isPayee.save()]);

  return res.status(201).json({
    message: "Transaction successfully completed.",
    transaction: successTran,
  });
});

// const newUserToBillTransaction = asyncHandler(async (req, res) => {
//   const user = req.user;
// });

const getTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const allTran = await TransactionModel.find({
    $or: [{ "payee.userRef": user._id }, { payer: user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("payee.userRef", "username upiId")
    .populate("payer", "username upiId");

  if (!allTran) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  return res
    .status(200)
    .json({ message: "Transaction History", allTransaction: allTran });
});

module.exports = { newUserToUserTransaction, getTransaction };

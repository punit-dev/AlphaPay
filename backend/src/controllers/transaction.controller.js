const TransactionModel = require("../models/transactionModel");
const UserModel = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const { comparePass } = require("../util/hash");

const newTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const { payee, amount, pin, method, message } = req.body;

  const isPayee = await UserModel.findOne({ upiId: payee });
  if (!isPayee) {
    res.status(404);
    throw new Error("Payee not found");
  }

  if (amount > user.walletBalance) {
    res.status(400);
    throw new Error("Your wallet balance is too low.");
  }

  if (!(await comparePass(user.upiPin, pin))) {
    const failedTran = await TransactionModel.create({
      payer: user._id,
      payee: isPayee._id,
      amount: amount,
      method: method,
      status: "FAILED",
      message: "Incorrect UPI Pin",
    });

    res.status(400);
    throw new Error("Your UPI Pin is Incorrect please try again.");
  }

  const successTran = await TransactionModel.create({
    payer: user._id,
    payee: isPayee._id,
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

const getTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const allTran = await TransactionModel.find({
    $or: [{ payee: user._id }, { payer: user._id }],
  })
    .populate("payee", "username upiId")
    .populate("payer", "username upiId");

  if (!allTran) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  return res
    .status(200)
    .json({ message: "Transaction History", allTransaction: allTran });
});

module.exports = { newTransaction, getTransaction };

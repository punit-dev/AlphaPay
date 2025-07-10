const TransactionModel = require("../models/transactionModel");
const UserModel = require("../models/userModel");
const BillModel = require("../models/billModel");
const CardModel = require("../models/cardModel");

const asyncHandler = require("express-async-handler");
const { comparePass } = require("../util/hash");

const newUserToUserTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const { payee, amount, pin, method, message, cardNumber } = req.body;

  if (!payee || !amount || !method || !pin) {
    res.status(400);
    throw new Error("All fields required.");
  }

  const isPayee = await UserModel.findOne({ upiId: payee });
  if (!isPayee) {
    res.status(404);
    throw new Error("Payee not found");
  }

  if (amount <= 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero.");
  }
  if (method == "wallet") {
    if (amount > user.walletBalance) {
      res.status(400);
      throw new Error("Your wallet balance is too low.");
    }
  }

  const isCard = await CardModel.findOne({
    $and: [{ userID: user._id }, { cardNumber: cardNumber }],
  });
  if (method == "card") {
    if (!isCard) {
      res.status(404);
      throw new Error("Card not found.");
    }
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
      method: {
        type: method,
        cardRef: method == "card" && isCard._id,
      },
      status: "FAILED",
      message: "Transaction failed.",
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
    method: {
      type: method,
      cardRef: method == "card" && isCard._id,
    },
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

const newUserToBillTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const { id, method, pin, cardNumber, amount, validity } = req.body;

  if (!id || !method || !pin || !amount || !validity) {
    res.status(400);
    throw new Error("All fields required.");
  }

  const isBill = await BillModel.findOne({
    $and: [{ userID: user._id }, { UId: id }],
  });

  if (!isBill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  if (method == "wallet") {
    if (amount > user.walletBalance) {
      res.status(400);
      throw new Error("Your wallet balance is low");
    }
  }

  if (method === "card" && !cardNumber) {
    res.status(400);
    throw new Error("Card number is required for card payments.");
  }

  const isCard = await CardModel.findOne({
    $and: [{ userID: user._id }, { cardNumber: cardNumber }],
  });
  if (method == "card") {
    if (!isCard) {
      res.status(404);
      throw new Error("Card not found.");
    }
  }

  if (!(await comparePass(user.upiPin, pin))) {
    const failedTran = await TransactionModel.create({
      payer: user._id,
      payee: {
        name: isBill.provider,
        type: "bill",
        billRef: isBill._id,
        accountOrPhone: isBill.UId,
      },
      amount: amount,
      method: {
        type: method,
        cardRef: method == "card" ? isCard._id : null,
      },
      status: "FAILED",
      message: "Transaction failed.",
    });

    res.status(400);
    throw new Error("Transaction failed. Please check details and try again.");
  }

  if (method == "wallet") {
    user.walletBalance -= amount;
    await user.save();
  }

  const successTran = await TransactionModel.create({
    payer: user._id,
    payee: {
      name: isBill.provider,
      type: "bill",
      billRef: isBill._id,
      accountOrPhone: isBill.UId,
    },
    amount: isBill.amount,
    method: {
      type: method,
      cardRef: method == "card" ? isCard._id : null,
    },
    status: "SUCCESS",
    message: "Bill paid",
  });
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + validity);
  isBill.dueDate = currentDate;
  isBill.markModified("dueDate");
  await isBill.save();

  return res
    .status(201)
    .json({ message: "Bill paid successfully", transaction: successTran });
});

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

module.exports = {
  newUserToUserTransaction,
  newUserToBillTransaction,
  getTransaction,
};

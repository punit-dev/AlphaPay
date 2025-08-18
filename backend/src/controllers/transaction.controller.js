const TransactionModel = require("../models/transactionModel");
const UserModel = require("../models/userModel");
const BillModel = require("../models/billModel");
const CardModel = require("../models/cardModel");

const asyncHandler = require("express-async-handler");
const { comparePass } = require("../util/hash");
const checkValidation = require("../util/checkValidation");

/**
 * @route   POST /api/transactions/userToUser
 * @desc    Transfer money from one user to another
 * @access  Private
 */
const newUserToUserTransaction = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { payee, amount, pin, method, message, cardID } = req.body;

  const isPayee = await UserModel.findOne({ upiId: payee });
  if (!isPayee) {
    res.status(404);
    throw new Error("Payee not found");
  }

  if (amount <= 0) {
    res.status(400);
    throw new Error("Amount must be greater than zero.");
  }

  // Wallet balance check
  if (method === "wallet" && amount > user.walletBalance) {
    res.status(400);
    throw new Error("Your wallet balance is too low.");
  }

  // Card payment validation
  if (method === "card" && !cardID) {
    res.status(400);
    throw new Error("Card ID is required for card payments.");
  }

  const isCard = await CardModel.findById(cardID);
  if (method == "card" && !isCard) {
    res.status(404);
    throw new Error("Card not found.");
  }

  // Validate UPI Pin
  if (!(await comparePass(user.upiPin, pin))) {
    const failedTran = await TransactionModel.create({
      payer: {
        userRef: user._id,
        transactionType: "DEBIT",
      },
      payee: {
        name: isPayee.fullname,
        type: "user",
        userRef: isPayee._id,
        accountOrPhone: isPayee.phoneNumber,
        transactionType: "CREDIT",
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

  // SUCCESS Transaction
  const successTran = await TransactionModel.create({
    payer: {
      userRef: user._id,
      transactionType: "DEBIT",
    },
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

  // Deduct wallet amount if wallet used
  if (method == "wallet") {
    user.walletBalance -= amount;
  }

  // Update balances
  isPayee.walletBalance += amount;

  await Promise.all([user.save(), isPayee.save()]);

  return res.status(201).json({
    message: "Transaction successfully completed.",
    transaction: successTran,
  });
});

/**
 * @route   POST /api/transactions/userToBill
 * @desc    Pay a bill using wallet or card
 * @access  Private
 */
const newUserToBillTransaction = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }
  const user = req.user;
  const { id, method, pin, cardID, amount, validity } = req.body;

  const isBill = await BillModel.findOne({
    $and: [{ userID: user._id }, { UId: id }],
  });

  if (!isBill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  if (method == "wallet" && amount > user.walletBalance) {
    res.status(400);
    throw new Error("Your wallet balance is low");
  }

  if (method === "card" && !cardID) {
    res.status(400);
    throw new Error("Card ID is required for card payments.");
  }

  const isCard = await CardModel.findById(cardID);
  if (method == "card") {
    if (!isCard) {
      res.status(404);
      throw new Error("Card not found.");
    }
  }

  if (!(await comparePass(user.upiPin, pin))) {
    const failedTran = await TransactionModel.create({
      payer: {
        userRef: user._id,
        transactionType: "DEBIT",
      },
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

  // Deduct wallet amount if wallet used
  if (method == "wallet") {
    user.walletBalance -= amount;
    await user.save();
  }

  const successTran = await TransactionModel.create({
    payer: {
      userRef: user._id,
      transactionType: "DEBIT",
    },
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

  // Extend due date after payment
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + validity);
  isBill.dueDate = currentDate;
  isBill.markModified("dueDate");
  await isBill.save();

  return res
    .status(201)
    .json({ message: "Bill paid successfully", transaction: successTran });
});

/**
 * @route   POST /api/transactions/walletRecharge
 * @desc    Recharge wallet using card
 * @access  Private
 */
const walletRecharge = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { amount, cardID, upiPin } = req.body;

  if (amount <= 0) {
    res.status(400);
    throw new Error("amount must be greater then 0");
  }

  // Validate card
  const card = await CardModel.findById(cardID);
  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  // Validate UPI Pin
  if (!(await comparePass(user.upiPin, upiPin))) {
    const failedTran = await TransactionModel.create({
      payer: {
        userRef: user._id,
        transactionType: "DEBIT",
      },
      payee: {
        name: user.fullname,
        type: "wallet",
        userRef: user._id,
        accountOrPhone: user.phoneNumber,
        transactionType: "CREDIT",
      },
      amount: amount,
      method: {
        type: "card",
        cardRef: card._id,
      },
      status: "FAILED",
      message: "Transaction failed.",
    });

    res.status(400);
    throw new Error("Transaction failed. Please check details and try again.");
  }

  // Recharge wallet
  user.walletBalance += amount;
  await user.save();

  // SUCCESS transaction
  const successTran = await TransactionModel.create({
    payer: {
      userRef: user._id,
      transactionType: "DEBIT",
    },
    payee: {
      name: user.fullname,
      type: "wallet",
      userRef: user._id,
      accountOrPhone: user.phoneNumber,
      transactionType: "CREDIT",
    },
    amount: amount,
    method: {
      type: "card",
      cardRef: card._id,
    },
    status: "SUCCESS",
    message: "Money added to wallet",
  });

  return res.status(201).json({
    message: "Money successfully add to you wallet.",
    transaction: successTran,
  });
});

/**
 * @route   GET /api/transactions/verifyTransaction?query=transactionId
 * @desc    Verify a transaction by ID
 * @access  Private
 */
const verifyTransaction = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { query } = req.query;

  const transaction = await TransactionModel.findById(query);
  if (!transaction) {
    res.status(404);
    throw new Error("This transaction is not valid.");
  }

  return res
    .status(200)
    .json({ message: "This transaction is verified.", transaction });
});

/**
 * @route   GET /api/transactions/allTransaction
 * @desc    Get all transactions of the logged-in user
 * @access  Private
 */
const getTransaction = asyncHandler(async (req, res) => {
  const user = req.user;
  const allTran = await TransactionModel.find({
    $or: [{ "payee.userRef": user._id }, { "payer.userRef": user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("payee.userRef", "username upiId")
    .populate("payer.userRef", "username upiId");

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
  walletRecharge,
  verifyTransaction,
  getTransaction,
};

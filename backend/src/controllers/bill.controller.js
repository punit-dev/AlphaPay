const BillModel = require("../models/billModel");

const asyncHandler = require("express-async-handler");

const registerBill = asyncHandler(async (req, res) => {
  const user = req.user;
  const { provider, UIdType, UId, category, nickname } = req.body;

  if (!provider || !UIdType || !UId || !category) {
    res.status(400);
    throw new Error("All fields required.");
  }

  const isBillExists = await BillModel.findOne({
    $and: [{ userID: user._id }, { UId }],
  });
  if (isBillExists) {
    res.status(400);
    throw new Error("This Bill is already exits.");
  }

  const newBill = await BillModel.create({
    userID: user._id,
    category: category,
    provider: provider,
    UIdType: UIdType,
    UId: UId,
    nickname: nickname || null,
  });
  return res
    .status(201)
    .json({ message: "Bill registered successfully", bill: newBill });
});

const getBills = asyncHandler(async (req, res) => {
  const user = req.user;
  const bills = await BillModel.find({ userID: user._id }).sort({
    updatedAt: -1,
  });

  if (bills.length == 0) {
    res.status(404);
    throw new Error("bills not available");
  }

  return res.status(200).json({ message: "All Bills", bills });
});

const updateBill = asyncHandler(async (req, res) => {
  const user = req.user;
  const { provider, UId, nickname } = req.body;
  const { query } = req.query;

  const bill = await BillModel.findOne({
    $and: [{ UId: query }, { userID: user._id }],
  });
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found.");
  }

  if (provider && provider != bill.provider) {
    bill.provider = provider;
  }
  if (UId && UId != bill.UId) {
    bill.UId = UId;
  }
  if (nickname) bill.nickname = nickname;

  await bill.save();

  return res
    .status(200)
    .json({ message: "Bill Updated Successfully", updatedBill: bill });
});

const deleteBill = asyncHandler(async (req, res) => {
  const user = req.user;
  const { query } = req.query;
  const bill = await BillModel.findOneAndDelete({
    $and: [{ UId: query }, { userID: user._id }],
  });

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found.");
  }

  return res
    .status(200)
    .json({ message: "Bill deleted Successfully", billID: bill._id });
});

module.exports = { registerBill, getBills, updateBill, deleteBill };

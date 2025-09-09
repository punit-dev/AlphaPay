const BillModel = require("../../models/user-models/billModel");

const asyncHandler = require("express-async-handler");
const checkValidation = require("../../util/checkValidation");

/**
 * @route   POST /api/bills/register-bill
 * @desc    Registers a new Bill
 * @access  Privet
 */
const registerBill = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { provider, UIdType, UId, category, nickname } = req.body;

  // Check bill exists or not
  const isBillExists = await BillModel.findOne({
    $and: [{ userId: user._id }, { UId }],
  });
  if (isBillExists) {
    res.status(400);
    throw new Error("This Bill is already exits.");
  }

  //register a new bill
  const newBill = await BillModel.create({
    userId: user._id,
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

/**
 * @route   GET /api/bills/get-bills
 * @desc    Get all bills of the logged-in user
 * @access  Privet
 */
const getBills = asyncHandler(async (req, res) => {
  const user = req.user;
  const bills = await BillModel.find({ userId: user._id }).sort({
    updatedAt: -1,
  });

  if (bills.length == 0) {
    res.status(404);
    throw new Error("bills not available");
  }

  return res.status(200).json({ message: "All Bills", bills });
});

/**
 * @route   PUT /api/bills/update-bill
 * @desc    Update specific bill of the logged-in user
 * @access  Privet
 */
const updateBill = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { provider, UId, nickname } = req.body;
  const { query } = req.query;

  const bill = await BillModel.findOne({
    $and: [{ UId: query }, { userId: user._id }],
  });
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found.");
  }

  //check is updated field are available then change if available
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

/**
 * @route   DELETE /api/bills/delete-bill
 * @desc    Delete specific bill of the logged-in user
 * @access  Privet
 */
const deleteBill = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { query } = req.query;
  const bill = await BillModel.findOneAndDelete({
    $and: [{ UId: query }, { userId: user._id }],
  });

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found.");
  }

  return res
    .status(200)
    .json({ message: "Bill deleted Successfully", billID: bill._id });
});

// Export all controller functions
module.exports = { registerBill, getBills, updateBill, deleteBill };

const CardModel = require("../models/cardModel");

const asyncHandler = require("express-async-handler");
const checkValidation = require("../util/checkValidation");
const isDateExpired = require("../util/dateCheck");

/**
 * @route   POST /api/cards/registerCard
 * @desc    Registers a new Card
 * @access  Privet
 */
const registerCard = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { cardNumber, CVV, expiryDate, cardHolder, type } = req.body;

  const card = await CardModel.findOne({
    cardNumber,
    userId: user._id,
  });
  if (card) {
    res.status(400);
    throw new Error("Card already saved.");
  }

  //check is given expiry is expired or not using isDateExpired utility
  if (isDateExpired(expiryDate)) {
    res.status(400);
    throw new Error("This card is expired");
  }

  const newCard = await CardModel.create({
    cardHolder,
    CVV,
    expiryDate,
    cardNumber,
    type,
    userId: user._id,
  });

  return res
    .status(201)
    .json({ message: "New Card added successfully", card: newCard });
});

/**
 * @route   GET /api/cards/getCards
 * @desc    Get all cards of the logged-in user
 * @access  Privet
 */
const getCards = asyncHandler(async (req, res) => {
  const user = req.user;
  const cards = await CardModel.find({ userId: user._id }).sort({
    createdAt: -1,
  });

  if (cards.length == 0) {
    res.status(404);
    throw new Error("Cards not available.");
  }

  return res.status(200).json({ message: "All cards", cards: cards });
});

/**
 * @route   DELETE /api/cards/deleteCard
 * @desc    Delete specific card of the logged-in user
 * @access  Privet
 */
const deleteCard = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { query } = req.query;
  const card = await CardModel.findByIdAndDelete(query);
  if (!card) {
    res.status(404);
    throw new Error("Card not found.");
  }

  return res
    .status(200)
    .json({ message: "Card deleted successfully", cardId: card._id });
});

module.exports = { registerCard, getCards, deleteCard };

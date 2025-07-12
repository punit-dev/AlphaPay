const CardModel = require("../models/cardModel");

const asyncHandler = require("express-async-handler");

const registerCard = asyncHandler(async (req, res) => {
  const user = req.user;
  const { cardNumber, CVV, expiryDate, cardHolder, type } = req.body;

  if (!cardNumber || !CVV || !expiryDate || !cardHolder || !type) {
    res.status(400);
    throw new Error("All fields required.");
  }

  const card = await CardModel.findOne({
    cardNumber,
    userID: user._id,
  });
  if (card) {
    res.status(400);
    throw new Error("Card already saved.");
  }

  const newCard = await CardModel.create({
    cardHolder,
    CVV,
    expiryDate,
    cardNumber,
    type,
    userID: user._id,
  });

  return res
    .status(201)
    .json({ message: "New Card added successfully", card: newCard });
});

const getCards = asyncHandler(async (req, res) => {
  const user = req.user;
  const cards = await CardModel.find({ userID: user._id }).sort({
    createdAt: -1,
  });

  if (cards.length == 0) {
    res.status(404);
    throw new Error("Cards not available.");
  }

  return res.status(200).json({ message: "All cards", cards: cards });
});

const deleteCard = asyncHandler(async (req, res) => {
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

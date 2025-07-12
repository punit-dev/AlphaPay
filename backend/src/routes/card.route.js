const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const CardController = require("../controllers/card.controller");
const cardValidator = require("../middleware/cardValidator");

route.post(
  "/registerCard",
  cardValidator.registerCardValidator,
  authMiddleware,
  CardController.registerCard
);
route.get("/getCards", authMiddleware, CardController.getCards);
route.delete(
  "/deleteCard",
  cardValidator.deleteCardValidator,
  authMiddleware,
  CardController.deleteCard
);

module.exports = route;

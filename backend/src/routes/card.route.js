const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const CardController = require("../controllers/card.controller");
const cardValidator = require("../middleware/cardValidator");

route.post(
  "/register-card",
  cardValidator.registerCardValidator,
  authMiddleware.userAuthMiddleware,
  CardController.registerCard
);
route.get(
  "/get-cards",
  authMiddleware.userAuthMiddleware,
  CardController.getCards
);
route.delete(
  "/delete-card",
  cardValidator.deleteCardValidator,
  authMiddleware.userAuthMiddleware,
  CardController.deleteCard
);

module.exports = route;

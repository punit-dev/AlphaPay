const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/user-middleware/authMiddleware");
const CardController = require("../../controllers/user-controllers/card.controller");
const cardValidator = require("../../middleware/user-middleware/cardValidator");

route.post(
  "/register-card",
  cardValidator.registerCardValidator,
  authMiddleware,
  CardController.registerCard
);
route.get("/get-cards", authMiddleware, CardController.getCards);
route.delete(
  "/delete-card",
  cardValidator.deleteCardValidator,
  authMiddleware,
  CardController.deleteCard
);

module.exports = route;

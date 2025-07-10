const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const CardController = require("../controllers/card.controller");

route.post("/registerCard", authMiddleware, CardController.registerCard);
route.get("/getCards", authMiddleware, CardController.getCards);
route.delete("/deleteCard", authMiddleware, CardController.deleteCard);

module.exports = route;

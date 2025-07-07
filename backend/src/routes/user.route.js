const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/user.controller");

route.get("/profile", authMiddleware, UserController.profile);

module.exports = route;

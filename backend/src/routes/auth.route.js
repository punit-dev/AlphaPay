const express = require("express");
const route = express.Router();

const UserController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/sendOtp", UserController.sendOTP);
route.post("/verifyOtp", UserController.verifyOTP);
route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.post("/logout", authMiddleware, UserController.logout);

module.exports = route;

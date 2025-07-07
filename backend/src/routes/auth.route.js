const express = require("express");
const route = express.Router();

const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/sendOtp", AuthController.sendOTP);
route.post("/verifyOtp", AuthController.verifyOTP);
route.post("/register", AuthController.register);
route.post("/login", AuthController.login);
route.post("/logout", authMiddleware, AuthController.logout);

module.exports = route;

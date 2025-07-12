const express = require("express");
const route = express.Router();

const { body } = require("express-validator");
const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const authValidator = require("../middleware/authValidator");

route.post("/sendOtp", authValidator.validateEmail, AuthController.sendOTP);
route.post("/verifyOtp", authValidator.validateOTP, AuthController.verifyOTP);
route.post(
  "/register",
  authValidator.validateRegister,
  AuthController.register
);
route.post("/login", authValidator.validateLogin, AuthController.login);
route.post("/logout", authMiddleware, AuthController.logout);

module.exports = route;

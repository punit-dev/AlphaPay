const express = require("express");
const route = express.Router();

const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const authValidator = require("../middleware/authValidator");

route.post(
  "/register",
  authValidator.validateRegister,
  AuthController.register
);
route.post("/verify-otp", authValidator.validateOTP, AuthController.verifyOTP);
route.post(
  "/resend-otp",
  authValidator.validateEmail,
  AuthController.resendOTP
);
route.post("/login", authValidator.validateLogin, AuthController.login);
route.post("/logout", authMiddleware, AuthController.logout);

module.exports = route;

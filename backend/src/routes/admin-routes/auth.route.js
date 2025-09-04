const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const authValidator = require("../../middleware/admin-middleware/authValidator");
const authController = require("../../controllers/admin-controllers/auth.controller");

route.post(
  "/register",
  authMiddleware,
  authValidator.validateRegister,
  authController.register
);
route.post("/login", authValidator.validateLogin, authController.login);

route.post("/logout", authMiddleware, authController.logout);

module.exports = route;

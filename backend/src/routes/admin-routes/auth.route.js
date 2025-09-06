const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");
const authValidator = require("../../middleware/admin-middleware/authValidator");
const authController = require("../../controllers/admin-controllers/auth.controller");
const checkRole = require("../../middleware/admin-middleware/checkRole");

route.post(
  "/register",
  authMiddleware,
  checkRole("superAdmin"),
  authValidator.validateRegister,
  authController.register
);
route.post("/login", authValidator.validateLogin, authController.login);

route.post("/logout", authMiddleware, authController.logout);

module.exports = route;

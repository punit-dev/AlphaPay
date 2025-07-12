const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/user.controller");
const userValidator = require("../middleware/userValidator");

route.get("/profile", authMiddleware, UserController.userProfile);
route.put(
  "/update",
  userValidator.validateUpdateUser,
  authMiddleware,
  UserController.updateUser
);
route.put(
  "/updatePass",
  userValidator.validateUpdatePass,
  authMiddleware,
  UserController.updatePass
);
route.put(
  "/updatePin",
  userValidator.validateUpdatePin,
  authMiddleware,
  UserController.updateUpiPin
);
route.delete("/delete", authMiddleware, UserController.deleteUser);
route.get(
  "/search",
  userValidator.validateSearchQuery,
  authMiddleware,
  UserController.search
);

module.exports = route;

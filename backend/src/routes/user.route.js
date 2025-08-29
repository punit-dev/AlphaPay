const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/user.controller");
const userValidator = require("../middleware/userValidator");

route.get(
  "/profile",
  authMiddleware.userAuthMiddleware,
  UserController.userProfile
);
route.put(
  "/update",
  userValidator.validateUpdateUser,
  authMiddleware.userAuthMiddleware,
  UserController.updateUser
);
route.put(
  "/update-pass",
  userValidator.validateUpdatePass,
  authMiddleware.userAuthMiddleware,
  UserController.updatePass
);
route.put(
  "/update-pin",
  userValidator.validateUpdatePin,
  authMiddleware.userAuthMiddleware,
  UserController.updateUpiPin
);
route.delete(
  "/delete",
  authMiddleware.userAuthMiddleware,
  UserController.deleteUser
);
route.get(
  "/search",
  userValidator.validateSearchQuery,
  authMiddleware.userAuthMiddleware,
  UserController.search
);

module.exports = route;

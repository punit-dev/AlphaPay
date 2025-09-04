const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const userValidator = require("../../middleware/admin-middleware/userValidator");
const userController = require("../../controllers/admin-controllers/user.controller");

route.get(
  "/",
  authMiddleware,
  userValidator.validateGetUsers,
  userController.getUsers
);
route.get("/profile", authMiddleware, userController.profile);

route.put(
  "/update",
  authMiddleware,
  userValidator.validateUpdateProfile,
  userController.updateProfile
);

route.put(
  "/update-role",
  authMiddleware,
  userValidator.validateUpdateRole,
  userController.updateProfile
);

route.put(
  "/update-password",
  authMiddleware,
  userValidator.validateUpdatePass,
  userController.updatePass
);

route.delete(
  "/delete",
  authMiddleware,
  userValidator.validateDeleteUser,
  userController.deleteUser
);

route.module.exports = route;

const express = require("express");
const route = express.Router();
const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");
const userValidator = require("../../middleware/admin-middleware/userValidator");
const userController = require("../../controllers/admin-controllers/user.controller");
const checkRole = require("../../middleware/admin-middleware/checkRole");

route.use(authMiddleware);

route.get(
  "/",
  checkRole("superAdmin"),
  userValidator.validateGetUsers,
  userController.getUsers
);
route.get("/profile", userController.profile);

route.put(
  "/update-role",
  checkRole("superAdmin"),
  userValidator.validateUpdateRole,
  userController.updateRole
);

route.put(
  "/update-password",
  userValidator.validateUpdatePass,
  userController.updatePass
);

route.delete(
  "/delete",
  checkRole("superAdmin"),
  userValidator.validateDeleteUser,
  userController.deleteUser
);

module.exports = route;

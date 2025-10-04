const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");
const userManagementValidator = require("../../middleware/admin-middleware/umValidator");
const userManagementController = require("../../controllers/admin-controllers/userManagement.controller");
const checkRole = require("../../middleware/admin-middleware/checkRole");

route.use(authMiddleware);
route.use(checkRole("admin", "superAdmin"));

route.get(
  "/",
  userManagementValidator.validateGetAllUsers,
  userManagementController.getAllUsers
);

route.get(
  "/transactions",
  userManagementValidator.validateUserByIdWithTransactions,
  userManagementController.getUserByIdWithTransactions
);

route.put(
  "/block",
  userManagementValidator.validateBlockUnblockDeleteUser,
  userManagementController.blockUser
);

route.put(
  "/unblock",
  userManagementValidator.validateBlockUnblockDeleteUser,
  userManagementController.unblockUser
);

route.delete(
  "/delete",
  userManagementValidator.validateBlockUnblockDeleteUser,
  userManagementController.deleteUser
);

module.exports = route;

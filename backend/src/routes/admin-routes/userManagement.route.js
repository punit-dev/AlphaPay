const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/admin-middleware/authMiddleware");
const userManagementValidator = require("../../middleware/admin-middleware/umValidator");
const userManagementController = require("../../controllers/admin-controllers/userManagement.controller");

route.get(
  "/",
  authMiddleware,
  userManagementValidator.validateGetAllUsers,
  userManagementController.getAllUsers
);

route.get(
  "/transactions",
  authMiddleware,
  userManagementValidator.validateUserByIdWithTransactions,
  userManagementController.getUserByIdWithTransactions
);

route.put(
  "/block",
  authMiddleware,
  userManagementValidator.validateBlockUnblockUser,
  userManagementController.blockUser
);

route.put(
  "/unblock",
  authMiddleware,
  userManagementValidator.validateBlockUnblockUser,
  userManagementController.unblockUser
);

module.exports = route;

const express = require("express");
const route = express.Router();

const { query } = require("express-validator");

const authMiddleware = require("../../middleware/user-middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../../controllers/user-controllers/notification.controller");

route.get("/get-notifications", authMiddleware, getNotifications);
route.put(
  "/mark-as-read",
  query("query").notEmpty().withMessage("Notification ID is required"),
  authMiddleware,
  markAsRead
);
route.delete(
  "/delete-notification",
  query("query").notEmpty().withMessage("Notification ID is required"),
  authMiddleware,
  deleteNotification
);

module.exports = route;

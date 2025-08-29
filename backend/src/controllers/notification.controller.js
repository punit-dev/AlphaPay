const NotificationModel = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");
const checkValidation = require("../util/checkValidation");

/**
 * @route   GET /api/notifications/get-notifications
 * @desc    Get all notifications of the logged-in user
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const user = req.user;

  const notifications = await NotificationModel.find({ userId: user._id })
    .sort({
      createdAt: -1,
    })
    .populate("userId", "username upiId");

  if (!notifications) {
    res.status(404);
    throw new Error("Notifications not found");
  }

  return res.status(200).json({ message: "Notifications", notifications });
});

/**
 * @route   PUT /api/notifications/mark-as-read
 * @desc    Mark a notification as read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  // Validate request
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { notificationId } = req.query;

  const notification = await NotificationModel.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  return res
    .status(200)
    .json({ message: "Notification marked as read", notification });
});

/**
 * @route   DELETE /api/notifications/delete-notification
 * @desc    Delete a notification
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { notificationId } = req.query;

  const notification = await NotificationModel.findByIdAndDelete(
    notificationId
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  return res
    .status(200)
    .json({ message: "Notification deleted successfully", notification });
});

module.exports = { getNotifications, markAsRead, deleteNotification };

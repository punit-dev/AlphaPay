const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["transaction", "bill", "card", "alert"],
    },
    action: {
      type: String,
      required: true,
      enum: ["credit", "debit", "added", "deleted", "due", "info"],
    },
    message: {
      type: String,
      required: true,
    },
    data: { type: Object },
    balance: { type: Number },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;

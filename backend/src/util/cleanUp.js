// cleanup.js
// ------------------------------
// 🧹 Inactive User Cleanup Script
// ------------------------------
// This script automatically deletes users who have been inactive
// for more than 15 days, along with their related data
// (transactions, bills, cards).
//
// ✅ Runs automatically every day at midnight using cron
// ✅ Can also be imported & called manually if needed
// ------------------------------

const cron = require("node-cron");
const moment = require("moment");

const UserModel = require("../models/userModel");
const BillModel = require("../models/billModel");
const CardModel = require("../models/cardModel");
const TransactionModel = require("../models/transactionModel");
const NotificationModel = require("../models/notificationModel");
const { Promise } = require("mongoose");

const cleanUp = async () => {
  try {
    const cutoff = moment().subtract(15, "days").toDate();

    //find inactive users
    const inactiveUsers = await UserModel.find({
      lastActiveAt: { $lt: cutoff },
    });

    for (const user of inactiveUsers) {
      console.log(`🗑️ Deleting user: ${user._id}`);

      // Delete user
      await UserModel.findByIdAndDelete(user._id);

      // Cascade delete related data
      await Promise.all([
        TransactionModel.deleteMany({ userId: user._id }),
        BillModel.deleteMany({ userId: user._id }),
        CardModel.deleteMany({ userId: user._id }),
        NotificationModel.deleteMany({ userID: user._id }),
      ]);
    }

    if (inactiveUsers.length > 0) {
      console.log(
        `✅ Deleted ${inactiveUsers.length} inactive users and related data.`
      );
    } else {
      console.log("ℹ️ No inactive users found today.");
    }
  } catch (error) {
    console.error("❌ Cleanup job failed:", error);
  }
};

// Schedule job: Runs every day at midnight (00:00)
cron.schedule("0 0 * * *", cleanUp);

module.exports = cleanUp;

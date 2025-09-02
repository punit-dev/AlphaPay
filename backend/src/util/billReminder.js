// billReminder.js
// ------------------------------
// Due bill reminder Script
// ------------------------------
// This script automatically sends reminders to users with due bills.
//
// ✅ Runs automatically every day at midnight using cron
// ✅ Can also be imported & called manually if needed
// ------------------------------

const moment = require("moment");
const UserModel = require("../models/user-models/userModel");
const BillModel = require("../models/user-models/billModel");
const NotificationModel = require("../models/user-models/notificationModel");
const { sendData } = require("./sockets");

const sendBillReminder = async () => {
  try {
    const bills = await BillModel.find();

    for (const bill of bills) {
      console.log(`Bill reminder: ${bill._id}`);
      const cutoff = moment(bill.dueDate).clone().subtract(2, "days");

      const user = await UserModel.findById(bill.userId);

      if (dueDate.isAfter(moment()) && dueDate.diff(moment(), "days") <= 2) {
        const notify = await NotificationModel.create({
          userId: user._id,
          type: "bill",
          action: "due",
          message: `Your ${bill.nickname || bill.category} bill is due soon.`,
          data: {
            billId: bill._id,
            dueDate: bill.dueDate,
            provider: bill.provider,
          },
        });

        sendData(user.socketID, "billReminder", notify);
      }
    }
  } catch (error) {
    console.error("❌ Bill reminder job failed:", error);
  }
};

module.exports = sendBillReminder;

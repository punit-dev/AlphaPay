const cron = require("node-cron");
const sendBillReminder = require("./util/billReminder");

// Bill reminders daily at 12:00 PM (noon)
cron.schedule("0 12 * * *", sendBillReminder);

console.log("✅ Cron jobs scheduled: reminders at 12:00");

const cron = require("node-cron");
const cleanUp = require("./util/cleanUp");
const sendBillReminder = require("./util/billReminder");

// Runs daily at 00:00 AM (midnight)
cron.schedule("0 0 * * *", cleanUp);

// Bill reminders daily at 12:00 PM (noon)
cron.schedule("0 12 * * *", sendBillReminder);

console.log("✅ Cron jobs scheduled: cleanup at 00:00, reminders at 12:00");

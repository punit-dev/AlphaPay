const dotenv = require("@dotenvx/dotenvx");
dotenv.config();
const server = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT;

//connect database then run server
connectDB(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// 🧹 Auto Cleanup Job
// ---------------------------------
// Importing cleanup script here ensures that
// the cron job for deleting inactive users
// will run automatically in the background.
// It does not block the main server.
// ---------------------------------
require("./src/util/cleanUp");

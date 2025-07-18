const dotenv = require("@dotenvx/dotenvx");
dotenv.config();
const server = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT;

connectDB(process.env.MONGOURI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

const dotenv = require("@dotenvx/dotenvx");
dotenv.config();
const server = require("./src/app");

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

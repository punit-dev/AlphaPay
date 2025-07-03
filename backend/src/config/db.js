const mongoose = require("mongoose");

const connect = async (uri) => {
  await mongoose.connect(uri);
  console.log("database is connected to server.");
};

module.exports = connect;

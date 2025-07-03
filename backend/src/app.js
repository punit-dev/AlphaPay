const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

connectDB(process.env.MONGOURI);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("this is the test route...");
});

module.exports = app;

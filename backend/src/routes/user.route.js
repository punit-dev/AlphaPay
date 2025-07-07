const express = require("express");
const route = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/user.controller");

route.get("/profile", authMiddleware, UserController.userProfile);
route.put("/update", authMiddleware, UserController.updateUser);
route.put("/updatePass", authMiddleware, UserController.updatePass);
route.put("/updatePin", authMiddleware, UserController.updateUpiPin);
route.delete("/delete", authMiddleware, UserController.deleteUser);

module.exports = route;

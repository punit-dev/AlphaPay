const { verifyToken } = require("../../util/token");
const asyncHandler = require("express-async-handler");
const UserModel = require("../../models/user-models/userModel");

const userAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Token is required");
  }

  let verify;
  try {
    verify = verifyToken(token);
  } catch (error) {
    res.status(401);
    throw new Error("Token invalid.");
  }

  const user = await UserModel.findById(verify.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  req.user = user;
  next();
});

module.exports = userAuthMiddleware;

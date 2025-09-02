const AdminUserModel = require("../../models/admin-models/userModel");
const { verifyToken } = require("../../util/token");
const asyncHandler = require("express-async-handler");

const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
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

  const user = await AdminUserModel.findById(verify.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  req.user = user;
  next();
});

module.exports = adminAuthMiddleware;

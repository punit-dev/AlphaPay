const express = require("express");
const route = express.Router();

const ReviewController = require("../controllers/review.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post(
  "/create",
  authMiddleware.userAuthMiddleware,
  ReviewController.createReview
);
route.get(
  "/get",
  authMiddleware.adminAuthMiddleware,
  ReviewController.getReviews
);

module.exports = route;

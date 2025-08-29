const ReviewModel = require("../models/reviewModel");
const UserModel = require("../models/userModel");
const { sendReview } = require("../util/mailer");

const asyncHandler = require("express-async-handler");

/**
 * @route   POST /api/reviews/create
 * @desc    Create a new review
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { rating, message } = req.body;

  const review = await ReviewModel.create({
    userId: user._id,
    rating,
    message,
  });

  const admin = await UserModel.findOne({ isAdmin: true });
  if (admin) {
    await sendReview(admin.email, review);
  }

  res.status(201).json({
    message: "Review created successfully",
    review,
  });
});

/**
 * @route   GET /api/reviews/get-all
 * @desc    Get all reviews
 * @access  only Admin
 */
const getReviews = asyncHandler(async (req, res) => {
  const { gtr, ltr, userId } = req.query;
  const filter = {};
  if (gtr) {
    filter.rating = { $gte: gtr };
  }
  if (ltr) {
    filter.rating = { ...filter.rating, $lte: ltr };
  }
  if (userId) {
    filter.userId = userId;
  }
  const reviews = await ReviewModel.find(filter)
    .populate("userId", "username")
    .sort({ createdAt: -1 });

  if (reviews.length === 0) {
    res.status(404);
    throw new Error("No reviews found");
  }

  res.status(200).json({
    message: "Reviews fetched successfully",
    reviews,
  });
});

module.exports = {
  createReview,
  getReviews,
};

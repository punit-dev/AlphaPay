const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const reviewModel = mongoose.model("review", reviewSchema);

module.exports = reviewModel;

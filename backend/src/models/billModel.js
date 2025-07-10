const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  provider: {
    type: String,
    required: true,
    trim: true,
  },
  UIdType: {
    type: String,
    required: true,
    enum: ["accountNumber", "mobileNumber", "email"],
  },
  UId: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  category: {
    type: String,
    enum: [
      "MobileReacher",
      "BroadbandReacher",
      "DTH/CableTVReacher",
      "GooglePayTopUp",
    ],
  },
  nickname: {
    type: String,
    trim: true,
    default: null,
  },
});

const BillModel = mongoose.model("bill", BillSchema);

module.exports = BillModel;

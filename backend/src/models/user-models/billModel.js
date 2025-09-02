const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  userId: {
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
      "MobileRecharge",
      "BroadbandRecharge",
      "DTH/CableTVRecharge",
      "GooglePayTopUp",
    ],
  },
  nickname: {
    type: String,
    trim: true,
    default: null,
  },
});

mongoose.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const BillModel = mongoose.model("bill", BillSchema);

module.exports = BillModel;

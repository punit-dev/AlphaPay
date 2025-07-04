const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  billerName: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    default: "PENDING",
    enum: ["PAID", "PENDING"],
  },
  category: {
    type: String,
    enum: ["Mobile", "Electricity", "Broadband", "Water"],
  },
});

const BillModel = mongoose.model("bill", BillSchema);

module.exports = BillModel;

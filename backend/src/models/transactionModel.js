const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    to: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    amount: {
      type: Number,
      default: 0,
    },
    method: {
      type: String,
      enum: ["UPI_ID", "wallet", "card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "PENDING",
    },
    message: {
      type: String,
      default: "Paid",
      trim: true,
    },
  },
  { timestamps: true }
);

TransactionSchema.pre("save", async (next) => {
  // if (!this.isModified("message")) return;
});

const TransactionModel = mongoose.model("user", TransactionSchema);

module.exports = TransactionModel;

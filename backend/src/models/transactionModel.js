const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    payer: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    payee: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    amount: {
      type: Number,
      default: 0,
      require: true,
    },
    method: {
      type: String,
      enum: ["UPI_ID", "card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
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

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = TransactionModel;

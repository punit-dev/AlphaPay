const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    payer: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    payee: {
      name: String,
      type: {
        type: String,
        enum: ["user", "bill"],
        required: true,
      },
      userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
      },
      billRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bill",
        default: null,
      },
      accountOrPhone: String,
    },
    amount: {
      type: Number,
      default: 0,
      require: true,
    },
    method: {
      type: {
        type: String,
        enum: ["wallet", "card"],
        required: true,
      },
      cardRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "card",
        default: null,
      },
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

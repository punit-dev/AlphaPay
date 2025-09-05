const mongoose = require("mongoose");

//adding an transactionType field on payer and payee;
const TransactionSchema = new mongoose.Schema(
  {
    payer: {
      userRef: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
      transactionType: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true,
      },
    },
    payee: {
      name: String,
      type: {
        type: String,
        enum: ["user", "bill", "wallet"],
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
      transactionType: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
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

mongoose.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = TransactionModel;

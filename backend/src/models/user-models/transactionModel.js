const mongoose = require("mongoose");

//adding an transactionType field on payer and payee;
const TransactionSchema = new mongoose.Schema(
  {
    initiatedBy: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    payer: {
      userRef: { type: mongoose.Types.ObjectId, ref: "user" },
      transactionType: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
      },
    },

    payee: {
      name: String,
      type: {
        type: String,
        enum: ["user", "bill", "wallet"],
        default: "wallet",
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

    category: {
      type: String,
      enum: [
        "TRANSFER", // normal user transfer
        "REFUND", // admin refund
        "DEDUCTION", // admin deduction
        "PAYMENT", // bill payment
        "TOPUP", // wallet top-up
      ],
      default: "TRANSFER",
    },

    amount: {
      type: Number,
      min: 1,
      require: true,
    },
    method: {
      type: {
        type: String,
        enum: ["wallet", "card"],
        default: "wallet",
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
      default: "Transaction completed",
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

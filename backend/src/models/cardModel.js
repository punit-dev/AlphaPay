const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  cardNumber: {
    type: String,
    required: true,
  },
  CVV: {
    type: String,
    require: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  cardHolder: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Visa", "Mastercard", "RuPay"],
  },
});

const CardModel = mongoose.model("card", CardSchema);

module.exports = CardModel;

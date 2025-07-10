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
  }, //must encrypt
  expire_date: {
    type: Date,
    required: true,
  },
  card_holder: {
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

CardSchema.pre("save", async (next) => {
  // if (!this.isModified("card_number")) return;
});

const CardModel = mongoose.model("card", CardSchema);

module.exports = CardModel;

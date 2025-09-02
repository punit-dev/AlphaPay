const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const CardSchema = new mongoose.Schema({
  userId: {
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
    type: String,
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
    enum: ["credit", "debit"],
  },
});

const encKey = process.env.ENCRYPTION_KEY;
const sigKey = process.env.SIG_KEY;

CardSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["cardNumber", "CVV", "expiryDate"],
});

mongoose.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const CardModel = mongoose.model("card", CardSchema);

module.exports = CardModel;

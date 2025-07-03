const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    upi_id: {
      type: String,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      min: [5, "username must be have 5 characters"],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerifiedPhoneNumber: {
      type: Boolean,
      required: true,
      default: false,
    },
    wallet_balance: {
      type: Number,
      default: 0,
    },
    UPI_Pin: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async (next) => {
  if (!this.upi_id && this.phone_number && this.isVerifiedPhoneNumber) {
    this.upi_id = `${this.phone_number}@alphapay`;
  }
  // if (!this.isModified("UPI_Pin")) return;
  next();
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;

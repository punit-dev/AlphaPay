const mongoose = require("mongoose");
const { hashPass } = require("../util/hash");

const UserSchema = new mongoose.Schema(
  {
    upiId: {
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
    password: {
      type: String,
      minlength: [8, "Password minimum 8"],
      required: true,
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
    phoneNumber: {
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
    walletBalance: {
      type: Number,
      default: 0,
    },
    upiPin: {
      type: String,
      required: true,
    },
    dateOfBirth: {
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
  if (!this.upi_id && this.username) {
    this.upi_id = `${this.username}@alphapay`;
  }
  if (this.isModified("upiPin")) {
    this.upiPin = await hashPass(this.upiPin, 10);
  }
  if (this.isModified("password")) {
    this.password = await hashPass(this.password, 10);
  }
  next();
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;

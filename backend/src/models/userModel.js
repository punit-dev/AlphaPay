const mongoose = require("mongoose");
const { hashPass } = require("../util/hash");
const encrypt = require("mongoose-encryption");

const UserSchema = new mongoose.Schema(
  {
    isAdmin: {
      type: Boolean,
      default: false,
    },
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
      required: true,
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
    otpToken: {
      type: String,
      default: null,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.upiId && this.username) {
    const username = this.username;
    this.upiId = `${username}@alphapay`;
  }
  if (this.isModified("upiPin")) {
    this.upiPin = await hashPass(this.upiPin, 10);
  }
  if (this.isModified("password")) {
    this.password = await hashPass(this.password, 10);
  }
  next();
});

const encKey = process.env.ENCRYPTION_KEY;
const sigKey = process.env.SIG_KEY;

UserSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["dateOfBirth"],
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;

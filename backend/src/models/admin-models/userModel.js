const mongoose = require("mongoose");
const { hashPass } = require("../../util/hash");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "superAdmin"],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPass(this.password, 10);
  }
  next();
});

mongoose.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    delete ret.lastLogin;
    return ret;
  },
});

const UserModel = mongoose.model("adminUser", UserSchema);

module.exports = UserModel;

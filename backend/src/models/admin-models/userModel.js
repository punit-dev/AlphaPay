const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
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
      default: Date.now,
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

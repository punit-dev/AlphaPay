require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./src/models/userModel");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Connected to MongoDB");

    // Check if an admin already exists
    const existingAdmin = await UserModel.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists.");
      process.exit();
    }

    // Create a new admin
    const newAdmin = new UserModel({
      username: "alphapay_admin",
      fullname: "AlphaPay Admin",
      password: "Alpha@123",
      email: "admin@alphapay.com",
      phoneNumber: "9999999999",
      isVerifiedEmail: true,
      isVerifiedPhoneNumber: true,
      dateOfBirth: new Date("1990-01-01"),
      '',
      isAdmin: true,
    });

    await newAdmin.save();
    console.log("Admin user created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();

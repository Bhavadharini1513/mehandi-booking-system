require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB Connected");
    console.log("=================================");

    // Admin details from .env
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
      process.exit(1);
    }

    // Check whether admin already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists, make sure they are admin
      existingUser.role = "admin";

      // Reset password
      existingUser.password = await bcrypt.hash(password, 10);

      await existingUser.save();

      console.log("=================================");
      console.log("Admin already exists");
      console.log("Admin role updated");
      console.log("Password updated");
      console.log("=================================");
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new admin
      const admin = new User({
        name: "Mehandi Admin",
        email: email,
        phone: "9899998888",
        address: "Admin Office",
        city: "Coimbatore",
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();

      console.log("=================================");
      console.log("ADMIN CREATED SUCCESSFULLY");
      console.log("=================================");
    }

    console.log("Email :", email);
    console.log("Role  : admin");
    console.log("=================================");

    await mongoose.disconnect();

    console.log("MongoDB Disconnected");
    process.exit(0);
  } catch (error) {
    console.error("=================================");
    console.error("ADMIN CREATION FAILED");
    console.error("=================================");
    console.error(error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();

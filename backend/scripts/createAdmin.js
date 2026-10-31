
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase().trim()
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      isActive: true
    });

    console.log("Admin created successfully!");
    console.log("Admin Email:", admin.email);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();

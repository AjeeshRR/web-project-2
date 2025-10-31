const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "First Name is required"], trim: true },
    lastName:  { type: String, required: [true, "Last Name is required"], trim: true },
    mobileNumber: {
      type: String,
      required: [true, "Mobile Number is required"],
      validate: { validator: (v) => phoneRegex.test(v), message: "Mobile Number must be a 10-digit number" },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      validate: { validator: (v) => emailRegex.test(v), message: "Invalid email" },
    },
    role: { type: String, required: [true, "Role is required"] },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [255, "Password must be less than or equal to 255 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);


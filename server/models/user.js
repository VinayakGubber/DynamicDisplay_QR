const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    termsAccepted: {
      type: Boolean,
      required: true,
    },
    scanCount: {
      type: Number,
      default: 0, //default 0
    },
    imageUrl: {
      type: String, // URL of uploaded image
      default: "", // empty until user uploads
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

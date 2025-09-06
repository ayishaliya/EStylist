const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      required: [true, "Gender is required"],
    },
    bodyType: {
      type: String,
      enum: ["hourglass", "rectangle", "invertedtriangle", "pear"],
      required: [true, "Body Type is required"],
    },
    preferredSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: [true, "Preferred Size is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

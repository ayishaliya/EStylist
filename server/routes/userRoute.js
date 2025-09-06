const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("User existing");
      return res.status(200).json({
        success: true,
        user,
      });
    }
    console.log("No such user");
    res.status(404).json({ error: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, age, gender, bodyType, preferredSize, password } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !age ||
    !gender ||
    !bodyType ||
    !preferredSize
  ) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (age < 18) {
    return res.status(400).json({ error: "Age should be above 18!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      bodyType,
      preferredSize,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

module.exports = router;

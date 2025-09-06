const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

const otpStore = {};

//  Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// API to Request OTP
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email is not registered!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    // delete after 5 minutes
    setTimeout(() => delete otpStore[email], 5 * 60 * 1000);

    try {
      await transporter.sendMail({
        from: `"EStylist" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
      });
      console.log(" Email sent successfully to:", email);
      res.json({ message: "OTP sent to your email!" });
    } catch (error) {
      console.error(" Email send error:", error);
      res.status(500).json({ error: `Failed to send email: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

// API to Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found!" });

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ message: "OTP verified successfully!", userId: user._id });
  } else {
    res.status(400).json({ error: "Invalid or expired OTP." });
  }
});

module.exports = router;

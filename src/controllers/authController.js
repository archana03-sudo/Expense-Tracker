console.log("authController loaded");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");

// ================= SIGNUP =================
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user._id,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 🔐 JWT TOKEN
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
});
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please add a username"],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  phone: {
    type: Number,
    required: [true, "Please add a phone number"],
  },
  role: {
    type: String,
    enum: ["Admin", "Master", "Agent"],
    default: "Agent",
  },
  twoDZ: {
    type: Number,
    default: 80,
  },
  divider: {
    type: String,
    enum: ["Cash", "100", "25"],
    default: "Cash",
  },
  commission: {
    type: Number,
    default: 0,
  },
  userrelationship: {
    user: String,
    commission: Number,
  },
  createByUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  createToUser: {
    id: mongoose.Schema.ObjectId,
    username: String,
    role: String,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlenght: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
User.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
User.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
User.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", User);

const mongoose = require("mongoose");

const Customer = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  phone: {
    type: Number,
    required: [true, "Please add a phone number"],
  },
  createByUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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
  betLimit: {
    type: Number,
    default: null,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", Customer);

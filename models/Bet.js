const mongoose = require("mongoose");

const Bet = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please add a username"],
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: "agent",
    required: true,
  },
  betNumbers: [{ number: Number, amount: Number }],
  betTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bet", Bet);

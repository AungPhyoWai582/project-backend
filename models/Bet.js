const mongoose = require("mongoose");

const Bet = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please add a chalan id"],
  },
  agent: {
    type: String,
    ref: "agent",
    required: true,
  },
  betNumbers: [{ number: Number, amount: Number }],
  totalAmount: Number,
  betTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bet", Bet);

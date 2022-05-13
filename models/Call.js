const mongoose = require("mongoose");

const Call = new mongoose.Schema({
  callname: {
    type: String,
    required: [true, "Please add a chalan id"],
  },
  user: {
    type: String,
    // ref: "user",
    required: true,
  },
  // betNumbers: [{ number: Number, amount: Number }],
  numbers: {
    type: Array,
    required: [true, "Please add a number lists"],
  },
  totalAmount: {
    type: String,
    required: [true, "Please add a total amount"],
  },
  win_lose: Boolean,
  win_amount: Number,
  commission: Number,
  betTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Call", Call);

const mongoose = require("mongoose");

const Call = new mongoose.Schema({
  callname: {
    type: String,
    required: [true, "Please add a chalan id"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userID",
    required: true,
  },
  // betNumbers: [{ number: Number, amount: Number }],
  numbers: {
    type: Array,
    required: [true, "Please add a number lists"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please add a total amount"],
  },
  win_lose: Number,
  win_amount: {
    type: Number,
    default: 100000,
  },
  commission: {
    type: Number,
    default: 0,
  },
  betTime: {
    type: Date,
    default: Date.now,
  },
});

Call.pre("save", async function (next) {
  this.win_lose =
    (await this.totalAmount) - (this.commission + this.win_amount);
});

module.exports = mongoose.model("Call", Call);

const mongoose = require("mongoose");

const Betdetail = new mongoose.Schema({
  betId: {
    type: mongoose.Schema.ObjectId,
    ref: "betId",
    required: true,
  },
  betamount: {
    type: Number,
    required: true,
  },
  betWin: {
    type: Boolean,
    default: false,
  },
  winNumber: {
    number: Number,
    amount: Number,
  },
  betCommission: {
    type: Number,
    default: 0,
  },
  hasBreakNumber: {
    checked: {
      type: Boolean,
      default: false,
    },
    numbers: { type: [{ number: Number, amount: Number }], default: null },
    hasWin: {
      checked: {
        type: Boolean,
        default: false,
      },
      number: { type: Number, default: null },
      amount: { type: Number, default: null },
    },
  },
  breakLimitExcess: {
    checked: {
      type: Boolean,
      default: false,
    },
    excessNumbers: {
      type: [{ number: Number, amount: Number }],
      default: null,
    },
  },
  betTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("BetDetail", Betdetail);

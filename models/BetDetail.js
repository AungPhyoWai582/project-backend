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
  betTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("BetDetail", Betdetail);

const mongoose = require("mongoose");

const Report = mongoose.Schema({
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: "agent",
    require: true,
  },
  bet: {
    type: mongoose.Schema.ObjectId,
    ref: "betId",
    require: true,
  },
  betAmount: {
    type: Number,
    require: true,
  },
  win_lose: {
    win: {
      win: Boolean,
      number: Number,
      winAmount: Number,
    },
  },
  commission: {
    type: Number,
    default: 0,
  },
  excessLists: {
    type: [
      {
        number: Number,
        amount: Number,
        win: {
          type: Boolean,
          default: false,
        },
        winAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  },
  betTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", Report);

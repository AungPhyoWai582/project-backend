const mongoose = require("mongoose");

const Report = mongoose.Schema({
  agentID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  callID: {
    type: mongoose.Schema.ObjectId,
    ref: "betId",
    require: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
  amount: Number,
  status: {
    type: String,
    default: null,
  },
  win: {
    type: Number,
    default: 0,
  },
  betTime: {
    type: Date,
  },
});

module.exports = mongoose.model("Report", Report);

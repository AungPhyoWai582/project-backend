const mongoose = require("mongoose");

const CallsReport = mongoose.Schema({
  agentID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  callID: {
    type: mongoose.Schema.ObjectId,
    ref: "Call",
    require: true,
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

module.exports = mongoose.model("Calls-Report", CallsReport);

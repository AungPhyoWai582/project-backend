const mongoose = require("mongoose");

const AgentsReport = mongoose.Schema({
  masterID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  agentID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  commission: Number,
  amount: Number,
  calls: Array,
  _date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Agents-Report", AgentsReport);

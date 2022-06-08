const mongoose = require("mongoose");

const AgentsReport = mongoose.Schema({
  // masterID: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  //   require: true,
  // },
  agentID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  commission: Number,
  amount: Number,
  calls: {
    type: mongoose.Schema.ObjectId,
    ref: "Call",
    require: true,
  },
  _date: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("Agents-Report", AgentsReport);

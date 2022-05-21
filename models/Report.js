const mongoose = require("mongoose");

const Report = mongoose.Schema({
  agentID: {
    type: mongoose.Schema.ObjectId,
    ref: "agent",
    require: true,
  },
  callID: {
    type: mongoose.Schema.ObjectId,
    ref: "betId",
    require: true,
  },
  bet: {
    type: Number,
    require: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
  winlose: Number,
  status: Boolean,
});

module.exports = mongoose.model("Report", Report);

const mongoose = require("mongoose");

const MastersReport = mongoose.Schema({
  adminID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  masterID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  commission: Number,
  amount: Number,
  agents: Array,
  _date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Masters-Report", MastersReport);

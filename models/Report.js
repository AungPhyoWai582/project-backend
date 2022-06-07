const mongoose = require("mongoose");

const Report = mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  commission: {
    type: Number,
    require: true,
  },
  bet_amount: {
    type: Number,
    require: true,
  },
  win: {
    type: Number,
    require: true,
  },
  data: Array,
  _date: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("Report", Report);

const mongoose = require("mongoose");

const Report = mongoose.Schema({
  userId: {
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
  data: {
    lager: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Lager",
      },
    ],
    calls: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Call",
      },
    ],
  },
  _date: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("Report", Report);

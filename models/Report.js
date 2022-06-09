const mongoose = require("mongoose");

const Report = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  createByUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    require: true,
  },
  commission: {
    type: Number,
    require: true,
  },
  bet: {
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
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  // _date: {
  //   type: Date,
  //   require: true,
  // },
});

module.exports = mongoose.model("Report", Report);

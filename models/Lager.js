const mongoose = require("mongoose");

const Lager = new mongoose.Schema({
  lottery: {
    type: mongoose.Schema.ObjectId,
    ref: "Lottery",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createByUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
  },

  _date: {
    type: Date,
    required: true,
  },
  _time: {
    type: String,
    required: true,
  },
  // commission: {
  //   type: Number,
  //   default: 0,
  // },
  calls: Array,
  sells: Array,
  in: {
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: String,
    win: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    numbers: Array,
    // read: Array,
  },
  out: {
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: String,
    win: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    numbers: Array,
    // send: Array,
  },
});

module.exports = mongoose.model("Lager", Lager);

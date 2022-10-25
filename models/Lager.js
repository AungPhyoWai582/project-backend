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
  totalAmount: {
    type: Number,
    default: 0,
  },
  win: {
    type: Number,
    default: 0,
  },
  originalBreak: {
    type: Number,
    default: null,
  },
  status: String,
  pout_tee: String,
  pout_tee_amount: Number,
  pout_tee_win: Number,
  numbers: Array,
  // // commission: {
  // //   type: Number,
  // //   default: 0,
  // // },
  // calls: Array,
  // sells: Array,
  // outcalls: Array,
  // in: {
  //   totalAmount: {
  //     type: Number,
  //     default: 0,
  //   },
  //   status: String,
  //   win: {
  //     type: Number,
  //     default: 0,
  //   },
  //   commission: {
  //     type: Number,
  //     default: 0,
  //   },
  //   numbers: Array,
  //   // read: Array,
  // },
  // out: {
  //   totalAmount: {
  //     type: Number,
  //     default: 0,
  //   },
  //   status: String,
  //   win: {
  //     type: Number,
  //     default: 0,
  //   },
  //   commission: {
  //     type: Number,
  //     default: 0,
  //   },
  //   numbers: Array,
  //   // send: Array,
  // },
});

module.exports = mongoose.model("Lager", Lager);

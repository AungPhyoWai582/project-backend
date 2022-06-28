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
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  _date: {
    type: Date,
    required: true,
  },
  _time: {
    type: String,
    required: true,
  },
  call: {
    type: Array,
    default: null,
  },
});

module.exports = mongoose.model("Lager", Lager);

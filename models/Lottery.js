const mongoose = require("mongoose");

const Lottery = new mongoose.Schema({
  pout_tee: {
    type: Number,
    default: null,
  },
  hot_tee: {
    type: Array,
    default: null,
  },
  superhot_tee: {
    type: Array,
    default: null,
  },
  play: {
    type: Boolean,
    required: true,
    default: false,
  },
  Timer: {
    type: Number,
    default: 0,
  },
  _time: {
    type: String,
    required: true,
  },

  _date: {
    type: Date,
    // default: Date.now,
  },
});

module.exports = mongoose.model("Lottery", Lottery);

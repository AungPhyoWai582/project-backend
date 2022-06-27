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
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  lager: Array,
});

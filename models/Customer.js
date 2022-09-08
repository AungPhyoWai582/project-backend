const mongoose = require("mongoose");

const Customer = mongoose.Schema({
  createByUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  commission: Number,
  betLimit: {
    type: Number,
    default: null,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", Customer);

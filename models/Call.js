const mongoose = require("mongoose");

const Call = new mongoose.Schema({
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
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  master: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  // betNumbers: [{ number: Number, amount: Number }],
  numbers: {
    type: Array,
    required: [true, "Please add a number lists"],
  },
  totalAmount: {
    type: Number,
    // required: [true, "Please add a total amount"],
  },
  status: String,
  pout_tee: String,
  pout_tee_amount: Number,
  pout_tee_win: Number,
  win: {
    type: Number,
    default: 0,
  },
  commission: {
    type: Number,
    default: 0,
  },
  betTime: {
    type: Date,
    default: Date.now,
  },
});

// Call.methods.computeCallInfo = async function (numbers,totalAmount,commission) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

Call.pre("save", async function () {
  let total = this.numbers.map((item) => Number(item.amount));
  this.totalAmount = total.reduce((pre, next) => pre + next, 0);
  // this.commission = this.

  // (await this.totalAmount) - (this.commission + this.win_amount);
});

module.exports = mongoose.model("Call", Call);

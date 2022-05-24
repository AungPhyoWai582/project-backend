const mongoose = require("mongoose");

const Call = new mongoose.Schema({
  callname: {
    type: String,
    required: [true, "Please add a chalan id"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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
  status: {
    type: String,
    default: null,
  },
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

Call.pre("save", async function (next) {
  let total = this.numbers.map((item) => Number(item.amount));
  this.totalAmount = total.reduce((pre, next) => pre + next, 0);
  // this.commission = this.

  // (await this.totalAmount) - (this.commission + this.win_amount);
});

module.exports = mongoose.model("Call", Call);

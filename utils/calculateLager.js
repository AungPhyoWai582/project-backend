const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("./ErrorResponse");
const Call = require("../models/Call");
const User = require("../models/User");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const colors = require("colors");
const { populate } = require("../models/Call");

exports.calculateLager = asyncHandler(async (req, res, next) => {
  let query;
  let calls;

  console.log(req.user);
  const { _id, commission } = req.user;
  const { lotteryId } = req.params;
  query = await Call.find({ lottery: lotteryId });

  console.log(query);

  if (_id) {
    calls = query.filter((f, key) => f.user._id.toString() === _id.toString());
  } else {
    calls = query;
  }

  console.log(colors.bgGreen(calls));

  const lager = [];

  const obj = {};

  const numbers = Array.prototype.concat.apply(
    [],
    calls.map((cal) => cal.numbers)
  );

  console.log(colors.bgBlue(numbers));

  numbers.forEach((num) => {
    if (obj.hasOwnProperty(num.number)) {
      obj[num.number] = Number(obj[num.number]) + Number(num.amount);
    } else {
      obj[num.number] = Number(num.amount);
    }
  });

  console.log(colors.bgRed(obj));

  for (var prop in obj) {
    lager.push({ number: prop, amount: obj[prop] });
  }

  const totalAmount = lager
    .map((lag) => Number(lag.amount))
    .reduce((pre, next) => pre + next, 0);

  console.log(lager);
  res.status(200).json({ success: true, lager, totalAmount });
});

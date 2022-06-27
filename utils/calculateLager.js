const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("./ErrorResponse");
const Call = require("../models/Call");
const User = require("../models/User");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const colors = require("colors");

exports.calculateLager = asyncHandler(async (lottery, userId) => {
  console.log("Calculate Lager");
  const lager = [];
  const user = await User.findById(userId);
  const calls = await Call.find({
    lottery: lottery._id,
    user: user._id,
  }).populate({
    path: "user",
    select: "name role",
  });
  console.log(colors.bgCyan(calls));

  const setNumbers = Array.prototype.concat.apply(
    [],
    calls.map((cal) => cal.numbers)
  );

  console.log(setNumbers);

  setNumbers.map((sn, key) => {
    if (lager.length === 0) {
      console.log(lager.length);
      lager.push(sn);
    } else if (lager.map((l) => l.number).includes(sn.number)) {
      lager[lager.findIndex((obj) => obj.number === sn.number)] = {
        number: sn.number,
        amount:
          Number(
            lager[lager.findIndex((obj) => obj.number === sn.number)].amount
          ) + Number(sn.amount),
      };
    } else {
      lager.push(sn);
    }
  });

  const totalAmount = lager
    .map((l) => Number(l.amount))
    .reduce((pre, next) => pre + next, 0);

  let obj = {
    lottery: lottery._id,
    user: userId,
    createByUser: user.createByUser,
    type: user.role,
    totalAmount: totalAmount,
    lager: lager,
  };

  try {
    await Lager.create(obj);
  } catch (err) {
    next(new ErrorResponse(err, 500));
  }
});

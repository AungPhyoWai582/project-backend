const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const ErrorResponse = require("./ErrorResponse");

const colors = require("colors");
const { calculateReport } = require("./calculateReport");

exports.calculatePoutTee = asyncHandler(async (lottery) => {
  //   console.log(colors.bgCyan("CalculatePoutTee", lottery.pout_tee));
  //  let lottery = await Lottery.findById(lottery._id);

  //   const { lottery } = req.body;

  let call = await Call.find({
    lottery: lottery._id,
  });

  console.log(call);

  call.map(async (c, key) => {
    console.log(c.betTime);
    const user = await User.findById(c.user.toString());
    let obj;
    let plusIndex;
    // console.log(user);

    c.numbers.map((cal, index) => {
      if (cal.number == lottery.pout_tee) {
        console.log("same", c.numbers[index]);
        plusIndex = index;
      }
    });

    // console.log(plusIndex);

    if (plusIndex === undefined) {
      console.log(colors.bgYellow(c._id, c.numbers[plusIndex]));
      obj = {
        status: "LOSE",
        commission: 0,
        win: 0,
      };
    } else {
      console.log(c._id, colors.bgYellow(c.numbers[plusIndex]));
      obj = {
        status: "WIN",
        commission: 0,
        win: c.numbers[plusIndex].amount * user.twoDZ,
      };
    }
    console.log(colors.green(obj));
    try {
      await Call.findByIdAndUpdate(c._id, obj, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      return next(new ErrorResponse(509, "Something went wrong"));
    }
  });

  console.log(colors.bgGreen("Successfully pout tee update ..."));
  // calculateReport(lottery);
});

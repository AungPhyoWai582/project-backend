const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const { updateAgent } = require("./Agent");
const AgentReport = require("../models/Reports/AgentsReport");
const colors = require("colors");
const { calculateReport } = require("../utils/calculateReport");
const Lottery = require("../models/Lottery");

exports.result = asyncHandler(async (req, res, next) => {
  let { lotteryId } = req.params;
  let { number } = req.body;
  // let startDate = new Date(2021, 5, 30);
  // let endDate = new Date(2022, 6, 1);
  // let users = await User.find();
  // console.log(users);

  let lottery = await Lottery.findById(lotteryId);
  if (lottery.pout_tee === null) {
    let call = await Call.find({
      lottery: lotteryId,
    });

    console.log(call);

    call.map(async (c, key) => {
      console.log(c.betTime);
      const user = await User.findById(c.user.toString());
      let obj;
      let plusIndex;
      // console.log(user);

      c.numbers.map((cal, index) => {
        if (cal.number == number) {
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
      try {
        await Call.findByIdAndUpdate(c._id, obj, {
          new: true,
          runValidators: true,
        });
      } catch (error) {
        return next(new ErrorResponse(509, "Something went wrong"));
      }
    });

    req.lotteryId = lotteryId;

    next();
  } else {
    res
      .status(402)
      .json({ success: false, error: "There has already pout tee" });
  }
});

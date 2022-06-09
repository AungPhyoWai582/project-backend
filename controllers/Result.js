const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const { updateAgent } = require("./Agent");
const AgentReport = require("../models/Reports/AgentsReport");
const colors = require("colors");
const { calculateReport } = require("../utils/calculateReport");

exports.result = asyncHandler(async (req, res, next) => {
  let { number } = req.body;
  // let startDate = new Date(2021, 5, 30);
  // let endDate = new Date(2022, 6, 1);
  // let users = await User.find();
  // console.log(users);
  let call = await Call.find({
    betTime: {
      $gte: new Date(2021, 5, 1).toISOString(),
      $lte: new Date(2022, 6, 1).toISOString(),
    },
  });
  // console.log(colors.bgYellow(call));
  // console.log(colors.bgYellow(startDate, endDate));

  // let users = await User.find();

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

    console.log(c._id, obj);
    try {
      await Call.findByIdAndUpdate(c._id, obj, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      return next(new ErrorResponse(509, "Something went wrong"));
    }
  });

  next();
});

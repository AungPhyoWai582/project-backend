const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const { updateAgent } = require("./Agent");
const Report = require("../models/Report");

exports.result = asyncHandler(async (req, res, next) => {
  let { number } = req.body;
  let call = await Call.find();

  call.map(async (c, index) => {
    // console.log(c.user);
    const user = await User.findById(c.user);
    let obj;
    let plusIndex;

    c.numbers.map((cal, index) => {
      if (cal.number == number) {
        console.log("same", c.numbers[index]);
        plusIndex = index;
      }
    });
    // console.log(c.numbers[index]);
    if (plusIndex) {
      obj = {
        callID: c._id,
        agentID: c.user,
        commission: c.totalAmount / user.commission,
        amount: c.totalAmount,
        status: "WIN",
        win: c.numbers[plusIndex].amount * user.twoDZ - c.totalAmount,
        betTime: c.betTime,
      };
    } else {
      obj = {
        callID: c._id,
        agentID: c.user,
        commission: c.totalAmount / user.commission,
        amount: c.totalAmount,
        status: "LOSE",
        win: 0,
        betTime: c.betTime,
      };
    }
    console.log(obj);
    await Report.create(obj);
  });

  res.status(200).json({ number: number, success: true });
});

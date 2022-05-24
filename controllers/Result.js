const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const { updateAgent } = require("./Agent");

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
        status: "WIN",
        commission: c.totalAmount / user.commission,
        win: c.numbers[plusIndex].amount * user.twoDZ - c.totalAmount,
      };
    } else {
      obj = {
        status: "LOSE",
        commission: c.totalAmount / user.commission,
        win: 0,
      };
    }
    console.log(obj);
    await Call.findByIdAndUpdate(call[index]._id, obj, {
      new: true,
      runValidators: true,
    });
  });

  res.status(200).json({ number: number, success: true });
});

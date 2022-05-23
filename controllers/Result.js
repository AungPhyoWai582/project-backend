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

    const nums = c.numbers.map((cal) => cal.number);

    if (nums.includes(number)) {
      console.log("same");
      let obj = {
        status: "WIN",
        commission: c.totalAmount / user.commission,
        // win: .amount * user.twoDZ - c.totalAmount,
      };
    } else {
      console.log("not same");
    }

    // c.numbers.map(async (cal) => {
    //   if (cal.number == number) {
    //     let obj = {
    //       status: "WIN",
    //       commission: c.totalAmount / user.commission,
    //       win: cal.amount * user.twoDZ - c.totalAmount,
    //     };

    //     await Call.findByIdAndUpdate(call[index]._id, obj, {
    //       new: true,
    //       runValidators: true,
    //     });
    //   }
    // });
    // let obj = {
    //   status: "LOSE",
    //   commission: c.totalAmount / user.commission,
    // };
    // await Call.findByIdAndUpdate(call[index]._id, obj, {
    //   new: true,
    //   runValidators: true,
    // });
  });

  res.status(200).json({ number: number, success: true });
});

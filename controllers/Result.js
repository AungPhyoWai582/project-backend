const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const { updateAgent } = require("./Agent");
const AgentReport = require("../models/Reports/AgentsReport");
const colors = require("colors");

exports.result = asyncHandler(async (req, res, next) => {
  let { number } = req.body;
  let call = await Call.find();
  // let users = await User.find();

  call.map(async (c, key) => {
    // console.log(c.user);
    const user = await User.findById(c.user.toString());
    let obj;
    let plusIndex;
    console.log(user);

    c.numbers.map((cal, index) => {
      if (cal.number == number) {
        console.log("same", c.numbers[index]);
        plusIndex = index;
      }
    });

    console.log(plusIndex);

    if (plusIndex) {
      obj = {
        status: "WIN",
        commission: 0,
        win: c.numbers[plusIndex].amount * user.twoDZ - c.totalAmount,
      };
    } else {
      obj = {
        status: "LOSE",
        commission: 0,
        win: 0,
      };
    }
    console.log(obj);
    try {
      await Call.findByIdAndUpdate(c._id, obj, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      return next(new ErrorResponse(509, "Something went wrong"));
    }
  });
  // users.map(async (usr, index) => {
  //   let body;
  //   if (usr.role === "Agent") {
  //     console.log("Agent");
  //     //   const agCalls = call.filter(
  //     //     (cal) => cal.user.toString() === usr._id.toString()
  //     //   );
  //     const agCalls = await Call.find({ user: usr._id });
  //     //   const total = agCalls.map((item) => item.totalAmount);
  //     //   const totalAmount = total.reduce((pre, next) => pre + next, 0);

  //     body = {
  //       masterID: usr.createByUser,
  //       agentID: usr._id,
  //       // commission: totalAmount / usr.twoDZ,
  //       // amount: totalAmount,
  //       calls: agCalls,
  //     };

  //     //   req.body = body;
  //     console.log(colors.bgGreen(body));
  //     //   await AgentReport.create(body);
  //     //   next();
  //   } else if (usr.role === "Master") {
  //     console.log("Master");
  //   }
  //   await AgentReport.create(body);
  // });
  res.status(200).json({ number: number, success: true });
});

const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const ErrorResponse = require("./ErrorResponse");

const colors = require("colors");
const { calculateReport } = require("./calculateReport");
const Lager = require("../models/Lager");
const OutCall = require("../models/OutCall");

exports.calculatePoutTee = asyncHandler(async (lottery) => {
  //   console.log(colors.bgCyan("CalculatePoutTee", lottery.pout_tee));
  //  let lottery = await Lottery.findById(lottery._id);

  //   const { lottery } = req.body;

  // In Process
  let call = await Call.find({
    lottery: lottery._id,
  }).populate({
    path: "user",
    select: "username name role twoDZ",
  });

  // Out Process
  let outcall = await OutCall.find({
    lottery: lottery._id,
  }).populate({
    path: "user",
    select: "username name role twoDZ",
  });

  console.log(call);

  // In Call Calculate
  call.map(async (c, key) => {
    console.log(c.user);
    let obj;
    let plusIndex;
    let user;
    // if (c.user.role === "Agent") za = c.customer.twoDZ;
    if (c.user.role === "Admin") {
      user = await User.findById(c.master.toString());
      // za = user.twoDZ;
    }
    if (c.user.role === "Master") {
      user = await User.findById(c.agent.toString());
      // za = user.twoDZ;
    }
    if (c.user.role === "Agent") {
      user = await User.findById(c.customer.toString());
      // za = user.twoDZ;
    }

    // if (c.user.role === "Admin") za = c.master.twoDZ;

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
        pout_tee: null,
        pout_tee_amount: 0,
        pout_tee_win: 0,
        commission: Number(c.totalAmount) * (user.commission / 100),
        win:
          Number(c.totalAmount) -
          Number(c.totalAmount) * (user.commission / 100),
      };
    } else {
      console.log(c._id, colors.bgYellow(c.numbers[plusIndex]));
      obj = {
        status: "WIN",
        pout_tee: c.numbers[plusIndex].number,
        pout_tee_amount: c.numbers[plusIndex].amount,
        pout_tee_win: c.numbers[plusIndex].amount * user.twoDZ,
        commission: Number(c.totalAmount) * (user.commission / 100),
        win:
          Number(c.totalAmount) -
          Number(c.totalAmount) * (user.commission / 100) -
          c.numbers[plusIndex].amount * user.twoDZ,
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

  // Out Call Calculate
  outcall.map(async (c, key) => {
    console.log(c.user);
    let obj;
    let plusIndex;
    let user = await User.findById(c.user._id.toString());

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
        pout_tee: null,
        pout_tee_amount: 0,
        pout_tee_win: 0,
        commission: Number(c.totalAmount) * (user.commission / 100),
        win:
          Number(c.totalAmount) -
          Number(c.totalAmount) * (user.commission / 100),
      };
    } else {
      console.log(c._id, colors.bgYellow(c.numbers[plusIndex]));
      obj = {
        status: "WIN",
        pout_tee: c.numbers[plusIndex].number,
        pout_tee_amount: c.numbers[plusIndex].amount,
        pout_tee_win: c.numbers[plusIndex].amount * user.twoDZ,
        commission: Number(c.totalAmount) * (user.commission / 100),
        win:
          Number(c.totalAmount) -
          Number(c.totalAmount) * (user.commission / 100) -
          c.numbers[plusIndex].amount * user.twoDZ,
      };
    }
    console.log(colors.green(obj));
    try {
      await OutCall.findByIdAndUpdate(c._id, obj, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      return next(new ErrorResponse(509, "Something went wrong"));
    }
  });

  let lager = await Lager.find({ lottery: lottery._id });

  lager.map(async (lgr, key) => {
    // console.log(colors.bgBlue(lgr));

    const user = await User.findById(lgr.user.toString());

    // console.log(user);
    let inObj;
    let in_plusIndex;

    // For lager in
    lgr.in.numbers.map((cal, index) => {
      if (cal.number == lottery.pout_tee) {
        console.log("same", lgr.in.numbers[index]);
        in_plusIndex = index;
      }
    });

    // console.log(plusIndex);

    if (in_plusIndex === undefined) {
      console.log(colors.bgYellow(lgr._id, lgr.in.numbers[in_plusIndex]));
      inObj = {
        status: "LOSE",
        commission: lgr.in.totalAmount * (user.commission / 100),
        win: 0,
      };
    } else {
      console.log(lgr._id, colors.bgYellow(lgr.in.numbers[in_plusIndex]));
      inObj = {
        status: "WIN",
        commission: lgr.in.totalAmount * (user.commission / 100),
        win:
          Number(lgr.in.totalAmount) -
          lgr.in.numbers[in_plusIndex].amount * user.twoDZ,
      };
    }

    let outObj;
    let out_plusIndex;

    // For lager out
    lgr.out.numbers.map((cal, index) => {
      if (cal.number == lottery.pout_tee) {
        console.log("same", lgr.out.numbers[index]);
        out_plusIndex = index;
      }
    });

    if (out_plusIndex === undefined) {
      console.log(colors.bgYellow(lgr._id, lgr.out.numbers[out_plusIndex]));
      outObj = {
        status: "LOSE",
        commission: lgr.out.totalAmount * (user.commission / 100),
        win: 0,
      };
    } else {
      console.log(lgr._id, colors.bgYellow(lgr.in.numbers[out_plusIndex]));
      outObj = {
        status: "WIN",
        commission: lgr.out.totalAmount * (user.commission / 100),
        win:
          Number(lgr.out.totalAmount) -
          lgr.out.numbers[out_plusIndex].amount * user.twoDZ,
      };
    }

    console.log(colors.green(inObj, outObj));
    // try {
    //   await Lager.findByIdAndUpdate(
    //     lgr._id,
    //     { in: inObj },
    //     {
    //       new: true,
    //       runValidators: true,
    //     }
    //   );
    // } catch (error) {
    //   return next(new ErrorResponse(509, "Something went wrong"));
    // }
  });

  console.log(colors.bgGreen("Successfully pout tee update ..."));
  // console.log(lager);
  // calculateReport(lottery);
});

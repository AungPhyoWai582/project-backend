const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const OutCall = require("../models/OutCall");
// const Report = require("../models/Report");
const BetDetail = require("../models/BetDetail");
const Lottery = require("../models/Lottery");

const colors = require("colors");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const { calculateReport } = require("../utils/calculateReport");
const { calculateLager } = require("../utils/calculateLager");
const User = require("../models/User");
const Customer = require("../models/Customer");
const moment = require("moment");

// Desc    GET USERS
// Route   GET api/v1/users/:agentId/calls
exports.getCalls = asyncHandler(async (req, res, next) => {
  console.log(req.originalUrl);
  let query;
  let calls;
  const { _id } = req.user;
  const { lotteryId } = req.params;

  console.log(colors.bgGreen(_id, lotteryId));

  query = await OutCall.find({ lottery: lotteryId })
    .populate({
      path: "user",
      select: "name role",
    })
    .populate({
      path: "customer",
      select: "name",
    });

  if (_id) {
    calls = query.filter((f, key) => f.user._id.toString() === _id.toString());
  } else {
    calls = query;
  }

  if (!calls) {
    return next(new ErrorResponse("Here no have bet lists", 404));
  }

  // console.log(calls);
  console.log(colors.bgBlue(calls));

  res.status(200).json({
    success: true,
    count: calls.length,
    data: calls,
    selfUrl: req.originalUrl,
  });
});

// Desc    GET USER
// Route   GET api/v1/agents/:agentId/calls
exports.getCall = asyncHandler(async (req, res, next) => {
  const call = await OutCall.findById(req.params.callId)
    .populate({
      path: "user",
      select: "name role",
    })
    .populate({
      path: "customer",
      select: "name",
    });

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: call });
});

// Desc    CREATE CALL
// Route   POST api/v1/agents/:agentId/calls
exports.createCall = asyncHandler(async (req, res, next) => {
  let betTime = moment(Date.now()).format("YYYY-MM-DD");

  const comUser = await Customer.findById(req.body.customer);
  let tAmt = req.body.numbers
    .map((item) => Number(item.amount))
    .reduce((pre, next) => pre + next, 0);

  // Add user to req.body
  req.body.user = req.user._id;
  req.body.user_role = req.user.role;
  req.body.lottery = req.params.lotteryId;
  req.body.totalAmount = tAmt;
  req.body.commission = Number(tAmt * (comUser.commission / 100));
  req.body.win = Number(tAmt * (comUser.commission / 100)) - Number(tAmt);
  req.body.betTime=betTime;
  // req.body.numbers.filter((num) => num.amount.toString() === "0");
  // const lottery = await Lottery.findById(req.params.lotteryId);

  const call = await OutCall.create(req.body);

  if (!call) {
    return next(new ErrorResponse("Something was wrong", 500));
  }

  // For Lager

  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role commission" });

  console.log(lager);
  const demolager = lager.numbers;

  const callNumbers = call.numbers;
  // const demolager = [...In.numbers];

  console.log(demolager, callNumbers);

  // // for lager call
  callNumbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            demolager[demolager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) - Number(cn.amount)
        ).toString(),
      };
    }
  });
  // demolager.filter((dl) => dl.amount.toString() === "0");

  // for lager bet
  const totalAmount = Number(lager.totalAmount) - Number(call.totalAmount);

  const updateLager = await Lager.findById(lager._id);

  // updateLager.calls = calls;
  updateLager.numbers = [...demolager].filter((dl) => dl.amount !== "0");
  updateLager.totalAmount = totalAmount;
  updateLager.win = totalAmount;
  // updateLager.in.commission = com;

  const upL = await updateLager.save();

  res.status(201).json({
    success: true,
    data: call,
    lager: upL,
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/user/:id
exports.updateCall = asyncHandler(async (req, res, next) => {
  const democall = await OutCall.findById(req.params.callId);

  let addNumbers;
  const updateCallNumbers = req.body.numbers.filter((obj) => {
    console.log(obj)
    if(obj.amount == "0"){
      addNumbers=democall.numbers[democall.numbers.findIndex(fn=>fn.number.toString()===obj.number.toString())]
    }else{
      return obj;
    }
  });

  let tAmt = updateCallNumbers
    .map((item) => Number(item.amount))
    .reduce((pre, next) => pre + next, 0);
  console.log(tAmt);

  const comUser = await Customer.findById(democall.customer);

  const commission = tAmt * (comUser.commission / 100);
  const win = Number(tAmt) - Number(tAmt * (comUser.commission / 100));
  console.log(updateCallNumbers);

  const outcall = await OutCall.findByIdAndUpdate(
    req.params.callId,
    {
      numbers: updateCallNumbers,
      totalAmount: tAmt,
      commission: commission,
      win: win,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!outcall) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  // // For Lager

  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role commission" });

  console.log(lager);
  const demolager = lager.numbers;

  const callNumbers = outcall.numbers;
  // const demolager = [...In.numbers];

  // console.log(demolager, callNumbers);

  // // for lager call
  callNumbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            demolager[demolager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) -
          (Number(cn.amount) -
            Number(
              democall.numbers[
                democall.numbers.findIndex((obj) => obj.number === cn.number)
              ].amount
            ))
        ).toString(),
      };
    }
  });


  if(addNumbers !== undefined){
      console.log('add ma gui')
      demolager[demolager.findIndex(obj=>obj.number.toString()===addNumbers.number.toString())] = {
        number:addNumbers.number,
        amount:(Number(demolager[demolager.findIndex(obj=>obj.number.toString()===addNumbers.number.toString())].amount)+Number(addNumbers.amount)).toString()
      }
  }

  const updatedemoLager =demolager.filter(obj=>obj.amount!=0)
  console.log(updatedemoLager)

  // for lager bet
  const totalAmount = updatedemoLager
    .map((dml) => Number(dml.amount))
    .reduce((pre, next) => pre + next, 0);

  const updateLager = await Lager.findById(lager._id);

  // updateLager.calls = calls;
  updateLager.numbers = updatedemoLager;
  updateLager.totalAmount = totalAmount;
  updateLager.win = totalAmount;
  // updateLager.in.commission = com;

  const upL = await updateLager.save();

  res.status(200).json({ success: true, data:outcall, lager: upL });
});

// Desc    DELETE USER
// Route   DELETE api/v1/user/:id
exports.deleteCall = asyncHandler(async (req, res, next) => {
  const deletecall = await OutCall.findByIdAndDelete(req.params.callId);

  if (!deletecall) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role commission" });

  console.log(lager);
  const demolager = lager.numbers;

  const callNumbers = deletecall.numbers;
  // const demolager = [...In.numbers];

  console.log(demolager, callNumbers);

  // // for lager call
  callNumbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            demolager[demolager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) + Number(cn.amount)
        ).toString(),
      };
    } else {
      demolager.push(cn);
    }
  });

  // const updatedemoLager =demolager.filter(obj=>obj.amount!=0)
  // for lager bet
  const totalAmount = demolager
    .map((dml) => Number(dml.amount))
    .reduce((pre, next) => pre + next, 0);

  const updateLager = await Lager.findById(lager._id);

  // updateLager.calls = calls;
  updateLager.numbers = demolager;
  updateLager.totalAmount = totalAmount;
  updateLager.win = totalAmount;
  // updateLager.in.commission = com;

  const upL = await updateLager.save();

  res.status(200).json({ success: true, data: {} });
});

exports.callNumbersTotal = asyncHandler(async (req, res, next) => {
  const { lotteryId, customerId } = req.params;
  const { id, role } = req.user;
  let calls;
  if (role === "Admin") {
    calls = await OutCall.find({
      user: id,
      master: customerId,
    })
      .populate({
        path: "user",
        select: "name role",
      })
      .populate({
        path: "master",
        select: "name role",
      });
  }
  if (role === "Master") {
    calls = await OutCall.find({ user: id, agent: customerId })
      .populate({
        path: "user",
        select: "name role",
      })
      .populate({
        path: "agent",
        select: "name role",
      });
  }
  if (role === "Agent") {
    calls = await OutCall.find({ user: id, customer: customerId })
      .populate({
        path: "user",
        select: "name role",
      })
      .populate({
        path: "customer",
        select: "name",
      });
  }

  console.log(calls);
  console.log(colors.bgBlack(id, role));

  const numsData = [];
  const obj = {};

  const numbers = Array.prototype.concat.apply(
    [],
    calls.map((cal) => cal.numbers)
  );

  numbers.forEach((num) => {
    if (obj.hasOwnProperty(num.number)) {
      obj[num.number] = Number(obj[num.number]) + Number(num.amount);
    } else {
      obj[num.number] = Number(num.amount);
    }
  });

  for (var prop in obj) {
    numsData.push({ number: prop, amount: obj[prop] });
  }

  const numsTotal = numsData
    .map((d) => Number(d.amount))
    .reduce((pre, next) => pre + next, 0);

  res.status(200).json({ success: true, numsData, numsTotal });
});

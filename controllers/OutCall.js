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
  // Add user to req.body
  req.body.user = req.user._id;
  req.body.user_role = req.user.role;
  req.body.lottery = req.params.lotteryId;

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

  const inLager = lager.in.numbers;
  const outLager = lager.out.numbers;

  const callNumbers = call.numbers;
  console.log(colors.bgGreen(outLager));
  // const demolager = [...In.numbers];

  //   console.log(inLager, callNumbers);
  // For out
  callNumbers.map((cn) => {
    if (outLager.map((l) => l.number).includes(cn.number)) {
      outLager[outLager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            outLager[outLager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) + Number(cn.amount)
        ).toString(),
      };
    } else {
      outLager.push(cn);
    }
  });
  console.log(colors.bgBlue(outLager));
  // // for lager in
  callNumbers.map((cn) => {
    if (inLager.map((l) => l.number).includes(cn.number)) {
      inLager[inLager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            inLager[inLager.findIndex((obj) => obj.number === cn.number)].amount
          ) - Number(cn.amount)
        ).toString(),
      };
    }
  });

  // for lager bet
  const inTotalAmount = Number(lager.in.totalAmount) - Number(call.totalAmount);

  // for lager commission
  const incom = inTotalAmount * (req.user.commission / 100);

  // for in data read
  const outcalls = await lager.outcalls;
  outcalls.push(call.id);

  // for lager bet
  const outTotal = Number(lager.out.totalAmount) + Number(call.totalAmount);

  // for lager commission
  const comOut = outTotal * (req.user.commission / 100);

  const updateLager = await Lager.findById(lager._id);
  updateLager.in.numbers = inLager;
  updateLager.in.totalAmount = inTotalAmount;
  updateLager.in.commission = incom;

  updateLager.outcalls = outcalls;

  updateLager.out.numbers = outLager;
  updateLager.out.totalAmount = outTotal;
  updateLager.out.commission = comOut;

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
  const call = await OutCall.findByIdAndUpdate(req.params.callId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: call });
});

// Desc    DELETE USER
// Route   DELETE api/v1/user/:id
exports.deleteCall = asyncHandler(async (req, res, next) => {
  const call = await OutCall.findByIdAndDelete(req.params.callId);

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }
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

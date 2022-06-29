const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
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
  let { agentId, lotteryId } = req.params;

  console.log(colors.bgGreen(agentId, lotteryId));

  query = await Call.find({ lottery: lotteryId }).populate({
    path: "user",
    select: "name role",
  });

  if (agentId) {
    calls = query.filter(
      (f, key) => f.user._id.toString() === agentId.toString()
    );
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
  const call = await Call.findById(req.params.callId).populate({
    path: "user",
    select: "name role",
  });

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: call });
});

// Desc    CREATE USERS
// Route   POST api/v1/agents/:agentId/calls
exports.createCall = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user._id;
  req.body.lottery = req.params.lotteryId;
  console.log(req.user);
  console.log(req.body);
  console.log(req.params.lotteryId);

  const lottery = await Lottery.findById(req.params.lotteryId);

  const call = await Call.create(req.body);

  if (!call) {
    return next(new ErrorResponse("Something was wrong", 500));
  }

  // For Lager

  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role" });

  // console.log(lager.lager);
  const demolager = lager.call;
  console.log(demolager);
  const callNumbers = call.numbers;
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
  console.log(colors.bgYellow(demolager));

  const updateLager = await Lager.findByIdAndUpdate(
    lager._id,
    {
      call: demolager,
      totalAmount: demolager
        .map((deml) => Number(deml.amount))
        .reduce((prev, next) => prev + next, 0),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // const lagerReturn = calculateLager(lottery, req.user._id);
  // // console.log(lagerReturn);

  // const lager = await Lager.create(lagerReturn);

  // For update real-time Report
  // calculateReport(lottery);

  res.status(201).json({
    success: true,
    data: call,
    lager: updateLager,
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/user/:id
exports.updateCall = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to get bet`, 401)
    );
  }

  const call = await Call.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: call });
});

// Desc    DELETE USER
// Route   DELETE api/v1/user/:id
exports.deleteCall = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to get bet`, 401)
    );
  }

  const call = await Call.findByIdAndDelete(req.params.id);

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
// const Report = require("../models/Report");
const BetDetail = require("../models/BetDetail");

const colors = require("colors");
const Report = require("../models/Report");

// Desc    GET USERS
// Route   GET api/v1/users/:agentId/calls
exports.getCalls = asyncHandler(async (req, res, next) => {
  console.log(req.user);
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

  console.log(colors.bgBlue(calls));

  if (!calls) {
    return next(new ErrorResponse("Here no have bet lists", 404));
  }

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
  console.log(req.body);
  console.log(req.params.lotteryId);

  // if (req.user.role !== "Agent") {
  //   return next(
  //     new ErrorResponse(
  //       `This user ${req.user.id} role is not authorize to access this route`,
  //       400
  //     )
  //   );
  // }

  const call = await Call.create(req.body);

  // const report = await Report.find({ lottery: req.params.lotteryId });
  // console.log(colors.bgRed(report));

  // req.lotteryId = req.params.lotteryId;
  next();
  res.status(201).json({
    success: true,
    data: call,
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

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
// const Report = require("../models/Report");
const BetDetail = require("../models/BetDetail");

// Desc    GET USERS
// Route   GET api/v1/users/:agentId/calls
exports.getCalls = asyncHandler(async (req, res, next) => {
  console.log(req.originalUrl);
  let query;

  console.log("ads;flkasdjf;");

  if (req.user) {
    console.log("blah blah");
    query = Call.find({
      user: req.user.role === "Agent" ? req.user._id : req.params.agentId,
    }).populate({
      path: "user",
      select: "name role",
    });
  } else {
    query = Call.find().populate({ path: "user", select: "name role" });
  }

  const callList = await query;

  console.log(callList);

  // // Copy req.query
  // const reqQuery = { ...query };

  // // Fields to execute
  // const removeFields = ["select", "sort", "page", "limit"];

  // // Loop over removeFields and delete them from reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);

  // let queryStr = JSON.stringify(reqQuery);
  // console.log(JSON.parse(queryStr));

  // query = Call.find(JSON.parse(queryStr));
  // // console.log(req.body.user);
  // const callList = await query;

  if (!callList) {
    return next(new ErrorResponse("Here no have bet lists", 404));
  }

  res.status(200).json({
    success: true,
    count: callList.length,
    data: callList,
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
  console.log(req.body);

  // if (req.user.role !== "Agent") {
  //   return next(
  //     new ErrorResponse(
  //       `This user ${req.user.id} role is not authorize to access this route`,
  //       400
  //     )
  //   );
  // }

  const call = await Call.create(req.body);

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

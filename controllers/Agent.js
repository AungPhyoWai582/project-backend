const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Agent = require("../models/Agent");

exports.getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Agent.find();
  console.log(req);
  res.status(200).json({
    success: true,
    counts: agents.length,
    data: agents,
  });
});

exports.getAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found id with ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: agent,
  });
});

exports.createAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.create(req.body);
  res.status(201).json({
    success: true,
    data: agent,
  });
});

exports.updateAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: agent,
  });
});

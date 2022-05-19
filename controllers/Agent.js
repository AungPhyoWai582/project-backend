const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Agent = require("../models/Agent");

const colors = require("colors");
const paginate = require("../utils/paginate");

exports.getAgents = asyncHandler(async (req, res, next) => {
  console.log(colors.bgBlue("Imcomming request from frontend..."));
  console.log(req.originalUrl);

  const { filter, sort, page, limit } = req.query;
  const selfUrl = req.originalUrl;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  for (i in sort) {
    sort[i] = parseInt(sort[i]);
  }

  let nextPage, prevPage;

  if (endIndex < (await Agent.countDocuments().exec())) {
    nextPage = {
      page: parseInt(page) + 1,
      limit: parseInt(limit),
    };
  }

  if (startIndex > 0) {
    prevPage = {
      page: parseInt(page) - 1,
      limit: parseInt(limit),
    };
  }

  const agents = await Agent.find(filter)
    .sort(sort)
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.status(200).json({
    success: true,
    counts: agents.length,
    data: agents,
    pagination: {
      prev: prevPage,
      next: nextPage,
      selfUrl: selfUrl,
    },
    // selfUrl: req.selfUrl,
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
  console.log(req.body);
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

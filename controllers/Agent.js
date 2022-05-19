const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Agent = require("../models/Agent");

const colors = require("colors");
const paginate = require("../utils/paginate");

exports.getAgents = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...query };

  // Fields to execute
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  console.log(JSON.parse(queryStr));

  query = Agent.find(JSON.parse(queryStr));

  // pagination
  const total = await Agent.countDocuments();
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || total;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  query = query.skip(startIndex).limit(limit);

  const agents = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    counts: agents.length,
    pagination,
    data: agents,
    selfUrl: req.originalUrl,
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

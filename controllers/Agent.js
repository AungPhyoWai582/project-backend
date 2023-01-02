const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

const colors = require("colors");
const paginate = require("../utils/paginate");

// Desc    GET USERS
// Route   GET api/v1/masters
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
  if (req.user._id) {
    query = await User.find({ createByUser: req.user._id }).populate({
      path: "createByUser",
      select: "name role",
    });
  } else {
    query = await User.find(JSON.parse(queryStr)).populate({
      path: "createByUser",
      select: "name role",
    });
  }

  // pagination
  const total = await User.countDocuments();
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || total;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  //   query = await query.skip(startIndex).limit(limit);

  const users = query;

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
    counts: users.length,
    pagination,
    data: users,
    selfUrl: req.originalUrl,
  });
});

// Desc    GET USER
// Route   GET api/v1/masters/:id
exports.getAgent = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found id with ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Desc    CREATE USER
// Route   POST api/v1/masters
exports.createAgent = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  req.body.createByUser = req.user.id;

  if (req.user.role !== "Master") {
    return next(
      new ErrorResponse(
        `This user ${req.user.id} role is not authorize to access this route`,
        400
      )
    );
  }
  req.body.role = "Agent";

  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/masters/:id
exports.updateAgent = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Desc    DELETE USER
// Route   DELETE api/v1/masters/:id
exports.deleteAgent = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

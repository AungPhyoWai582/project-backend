const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

const colors = require("colors");
const paginate = require("../utils/paginate");

// Desc    GET USERS
// Route   GET api/v1/masters
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...query };

  // Fields to execute
  const removeFields = ["select", "sort", "page", "limit","rowperpage"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  console.log(JSON.parse(queryStr));

  // pagination
  const pagination = {};

  const total = await User.countDocuments({ createByUser: req.user._id });
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || total;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

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

  // query = query.skip(startIndex).limit(limit);

  // pagination result
  if (req.user._id) {
    query = await User.find({ createByUser: req.user._id })
      .limit(limit)
      .skip(startIndex)
      .populate({
        path: "createByUser",
        select: "name role",
      });
  } else {
    query = await User.find(JSON.parse(queryStr))
      .limit(limit)
      .skip(startIndex)
      .populate({
        path: "createByUser",
        select: "name role",
      });
  }

  const users = query;

  let counts;
  if (total % limit === 0) {
    counts = parseInt(total/limit);
    console.log(colors.bgBlue(parseInt(total/limit)))
  } else {
    counts =parseInt(total/limit) +1;
    // console.log(parseInt(total/req.query.rowperpage)+1)
    console.log(colors.bgBlue(parseInt(total/limit)+Number(1)))
  }
  // console.log(counts,req.query.rowperpage);
  res.status(200).json({
    success: true,
    counts: counts,
    pagination,
    data: users,
    selfUrl: req.originalUrl,
  });
});

// Desc    GET USER
// Route   GET api/v1/masters/:id
exports.getUser = asyncHandler(async (req, res, next) => {
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
exports.createUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  req.body.createByUser = req.user.id;

  if (req.user.role === "Admin") {
    req.body.role = "Master";
  }
  if (req.user.role === "Master") {
    req.body.role = "Agent";
  }

  if (req.user.role === "Agent") {
    req.body.role = "Customer";
  }

  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/masters/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
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
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

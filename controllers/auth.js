const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

// Get Users
exports.getUsers = asyncHandler(async (req, res, next) => {
  const userLists = await User.find();

  if (!userLists) {
    return next(new ErrorResponse("There is no user", 404));
  }

  res.status(200).json({ success: true, data: userLists });
});

//Create User
exports.createUser = asyncHandler(async (req, res, next) => {
  const { username, name, phone, password, role } = req.body;

  // Create Agent
  const agent = await Agent.create({
    username,
    name,
    phone,
    password,
    role,
  });

  // Create token
  const token = agent.getSignedJwtToken();

  res.status(201).json({ success: true, data: agent, token });
});

// Agent Login
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  console.log(req.body);

  // Validate username and password
  if (!username || !password) {
    return next(new ErrorResponse("Please provide username and password", 400));
  }

  // Check for user
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invilad Credentials", 401));
  }

  // Check for password
  const isMatch = await user.matchPassword(password);
  console.log(isMatch);
  if (!isMatch) {
    return next(new ErrorResponse("Invilad Credentials", 401));
  }

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

// Get current login user
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  console.log("get user with auth");
  console.log(req.user);
  const users = await User.find({ createByUser: req.user._id });
  console.log(users);
  if (!users) {
    return next(new ErrorResponse("There is no users", 404));
  }

  res.status(200).json({ success: true, count: users.length, users: users });
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("There is no user with that username", 400));
  }

  console.log(user);

  // const resetToken = user.getResetPasswordToken();

  // Set new password
  user.password = req.body.password;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });

  // const resetToken = user.getResetPasswordToken();

  // await user.save({ validateBeforeSave: false });
});

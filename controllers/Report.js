const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const AgentsReport = require("../models/Reports/AgentsReport");
const User = require("../models/User");
const Call = require("../models/Call");
const Report = require("../models/Report");
// const Report = require("../models/Report");

// Desc    GET USERS
// Route   GET api/v1/reports/calls
exports.agentReports = asyncHandler(async (req, res, next) => {
  let { agentId } = req.params;
  console.log(colors.bgRed(req.params.agentId));

  const report = await Report.find({
    userId: agentId ? agentId : req.user._id,
  }).populate({
    path: "data.calls",
    select: "callname totalAmount win status",
  });

  console.log(req.user);
  res.status(200).json({ success: true, data: report });
});

// Desc GET Masters
// Route GET api/v1/reports/master
exports.masterReports = asyncHandler(async (req, res, next) => {
  console.log(colors.bgRed(req.user));
  const report = await Report.find({ userId: req.user._id }).populate({
    path: "data.users",
    select: "username role",
    path: "userId",
    select: "username role",
  });
  console.log(report);
  res.status(200).json({ success: true, data: "Masters-Report", report });
});

// Desc GET agents of one master
// Route GET api/v1/reports/master/agents
exports.getMaster_select_agents = asyncHandler(async (req, res, next) => {
  const report = await Report.find({ createByUser: req.user._id });

  console.log(report);
  res.status(200).json({ success: true, data: report });
});

// Desc GET agent of one master
// Route GET api/v1/reports/master/agents/:agentId
exports.getMaster_select_agents_select_agentId = asyncHandler(
  async (req, res, next) => {
    res.status(200).json({ success: true, message: req.originalUrl });
  }
);

exports.createAgent = asyncHandler(async (req, res, next) => {
  console.log(colors.bgGreen(req.body));
});

// Desc GET Admin
// Route GET api/v1/reports/admin
exports.getAdmins = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: "Agents-Report" });
});

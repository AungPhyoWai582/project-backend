const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Report = require("../models/Report");

// Desc    GET USERS
// Route   GET api/v1/reports
exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find();
  if (reports.length <= 0) {
    return next(new ErrorResponse(`Report not found`, 404));
  }
  res.status(200).json({ success: true, data: reports });
});

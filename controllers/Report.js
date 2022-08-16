const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const Lager = require("../models/Lager");

exports.allTotal = asyncHandler(async (req, res, next) => {
  console.log(req.originalUrl);
  let report;

  const lager = await Lager.find({ user: req.user._id })
    .populate({
      path: "user",
      select: "username name",
    })
    .populate({
      path: "createByUser",
      select: "username role",
    });
  if (!lager) {
    return next(new ErrorResponse("Lager not found", 404));
  }

  // const IN = await lager.in;

  // console.log(lager.in.totalAmount);

  report = {
    me: {
      totalAmount: lager.in,
      win: lager.in,
    },
  };

  console.log(report);

  res.status(200).json({
    success: true,
    // data: IN,
    report,
    url: req.originalUrl,
  });
});

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const Lager = require("../models/Lager");
const Call = require("../models/Call");
const User = require("../models/User");

exports.membersCollections = asyncHandler(async (req, res, next) => {
  // const start = new Date();
  console.log(req.originalUrl);
  var memberReport = [];

  // const lager = await Lager.find({ user: req.user._id });

  const members = await User.find({ createByUser: req.user._id });

  const calls = await Call.find({
    user: req.user._id,
    agent: members.map((m) => m._id),
    _date: {
      $gte: "2022-08-11T05:59:04.654+00:00",
      $lte: "2022-08-30T05:59:04.654+00:00",
    },
  });
  // .populate({ path: "user", select: "username name role" })
  // .populate({ path: "agent", select: "username name role" });

  members.map((m) => {
    let obj = {};

    const c = calls.filter((cal) => cal.agent.toString() === m.id.toString());
    const totalAmount = c
      .map((cal) => Number(cal.totalAmount))
      .reduce((pre, next) => pre + next, 0);

    const totalCommission = c
      .map((cal) => Number(cal.commission))
      .reduce((pre, next) => pre + next, 0);

    const totalWin = c
      .map((cal) => Number(cal.win))
      .reduce((pre, next) => pre + next, 0);

    obj = {
      username: m.username,
      name: m.name,
      role: m.role,
      totalAmount,
      totalCommission,
      totalWin,
    };
    // console.log(colors.bgGreen(obj));

    memberReport.push(obj);
  });

  const report = {
    me: {
      totalAmount: memberReport
        .map((mr) => Number(mr.totalAmount))
        .reduce((pre, next) => pre + next, 0),
      totalCommission: memberReport
        .map((mr) => Number(mr.totalCommission))
        .reduce((pre, next) => pre + next, 0),
      totalWin: memberReport
        .map((mr) => Number(mr.totalWin))
        .reduce((pre, next) => pre + next, 0),
    },
    memberReport,
  };

  console.log(colors.bgGreen(report));

  res.status(200).json({
    success: true,
    report,
    // data: IN,
    // report: { totalAmount, totalWin, totalCommission },

    url: req.originalUrl,
  });
});

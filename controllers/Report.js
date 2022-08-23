const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const Lager = require("../models/Lager");
const Call = require("../models/Call");
const User = require("../models/User");

exports.membersCollections = asyncHandler(async (req, res, next) => {
  // const start = new Date();

  let { start_date, end_date } = await req.query;
  const start = new Date(start_date);
  const end = new Date(end_date);

  // const start = "Fri Aug 19 2022 12:42:18 GMT+0630";

  console.log(start.toISOString(), end.toISOString());

  // console.log(JSON.parse(queryStr));

  var memberReport = [];

  // const lager = await Lager.find({ user: req.user._id });

  const members = await User.find({ createByUser: req.user._id });

  const calls = await Call.find({
    user: req.user._id,
    agent: members.map((m) => m._id),
    betTime: {
      $gte: start.toISOString(),
      $lte: end.toISOString(),
    },
  });

  // .populate({ path: "user", select: "username name role" })
  // .populate({ path: "agent", select: "username name role" });
  if (!calls.length) {
    return next(new ErrorResponse(`Reports not found`, 404));
  }
  members.map((m) => {
    let obj = {};

    const c = calls.filter((cal) => cal.agent.toString() === m.id.toString());
    const pout_tee_amount = c
      .map((cal) => Number(cal.pout_tee_amount))
      .reduce((pre, next) => pre + next, 0);
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
      pout_tee_amount,
      totalAmount,
      totalCommission,
      totalWin,
    };
    // console.log(colors.bgGreen(obj));

    memberReport.push(obj);
  });

  memberReport.map((mr) => console.log(mr));

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
      pout_tee_amount: memberReport
        .map((mr) => Number(mr.pout_tee_amount))
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

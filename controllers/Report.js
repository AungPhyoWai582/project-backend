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
  let calls;

  const members = await User.find({ createByUser: req.user._id });

  if (req.user.role === "Admin") {
    calls = await Call.find({
      user: req.user._id,
      master: members.map((m) => m._id),
      betTime: {
        $gte: start.toISOString(),
        $lte: end.toISOString(),
      },
    });
  }
  if (req.user.role === "Master") {
    calls = await Call.find({
      user: req.user._id,
      agent: members.map((m) => m._id),
      betTime: {
        $gte: start.toISOString(),
        $lte: end.toISOString(),
      },
    });
  }
  if (req.user.role === "Agent") {
    calls = await Call.find({
      user: req.user._id,
      customer: members.map((m) => m._id),
      betTime: {
        $gte: start.toISOString(),
        $lte: end.toISOString(),
      },
    });
  }

  // .populate({ path: "user", select: "username name role" })
  // .populate({ path: "agent", select: "username name role" });
  if (!calls.length) {
    return next(new ErrorResponse(`Reports not found`, 404));
  }
  members.map((m) => {
    let obj = {};
    let c;
    if (req.user.role === "Admin") {
      c = calls.filter((cal) => cal.master.toString() === m.id.toString());
    }
    if (req.user.role === "Master") {
      c = calls.filter((cal) => cal.agent.toString() === m.id.toString());
    }
    if (req.user.role === "Agent") {
      c = calls.filter((cal) => cal.customer.toString() === m.id.toString());
    }
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

exports.outCollections = asyncHandler(async (req, res, next) => {
  let { start_date, end_date } = await req.query;
  const start = new Date(start_date);
  const end = new Date(end_date);

  const lagers = await Lager.find({
    user: req.user._id,
    _date: {
      $gte: start.toISOString(),
      $lte: end.toISOString(),
    },
  });
  const callIDs = Array.prototype.concat.apply(
    [],
    lagers.map((lgr) => lgr.out.send)
  );
  const calls = await Call.find({ _id: callIDs })
    .populate({
      path: "user",
      select: "username name role",
    })
    .populate({
      path: "master",
      select: "username name role",
    })
    .populate({
      path: "agent",
      select: "username name role",
    });

  const pout_tee_amount = calls
    .map((cal) => Number(cal.pout_tee_amount))
    .reduce((pre, next) => pre + next, 0);
  const totalAmount = calls
    .map((cal) => Number(cal.totalAmount))
    .reduce((pre, next) => pre + next, 0);

  const totalCommission = calls
    .map((cal) => Number(cal.commission))
    .reduce((pre, next) => pre + next, 0);

  const totalWin = calls
    .map((cal) => Number(cal.win))
    .reduce((pre, next) => pre + next, 0);

  const totalOut = {
    pout_tee_amount,
    totalAmount,
    totalCommission,
    totalWin,
  };
  const report = { calls, totalOut };

  res.status(200).json({ success: true, out: "this is out data", report });
});

exports.daily = asyncHandler(async (req, res, next) => {
  let { start_date, end_date } = await req.query;
  const start = new Date(start_date);
  const end = new Date(end_date);
  console.log(start, end);
  const lagers = await Lager.find({
    user: req.user._id,
    _date: {
      $gte: start.toISOString(),
      $lte: end.toISOString(),
    },
  });
  console.log(lagers);
  res.status(200).json({ success: true, report: lagers });
});

exports.dailyMembers = asyncHandler(async (req, res, next) => {
  const { lager } = req.query;
  // const ldate = new Date(date);
  // console.log(ldate.toISOString());
  const lagers = await Lager.findById(lager);

  const calls = await Call.find({ _id: lagers.in.read })
    .populate({
      path: "user",
      select: "username name role",
    })
    .populate({
      path: "master",
      select: "username name role",
    })
    .populate({
      path: "agent",
      select: "username name role",
    });
  // console.log(calls);
  const result = [];

  let c;
  if (req.user.role === "Admin") {
    c = [...new Set(calls.map((cal) => cal.master))];
  }
  if (req.user.role === "Master") {
    c = [...new Set(calls.map((cal) => cal.agent))];
  }
  if (req.user.role === "Agent") {
    c = [...new Set(calls.map((cal) => cal.customer))];
  }
  c.map((cl) => result.push({ member: cl }));
  // const demo = [...result];
  result.map((rs, key) => {
    console.log(rs.member._id);
    let memCalls;
    if (req.user.role === "Admin") {
      memCalls = calls.filter((cal) => cal.master._id === rs.member._id);
    }
    if (req.user.role === "Master") {
      memCalls = calls.filter((cal) => cal.agent._id === rs.member._id);
      console.log(memCalls);
    }
    if (req.user.role === "Agent") {
      memCalls = calls.filter((cal) => cal.customer._id === rs.member._id);
    }

    const pout_tee_amount = memCalls
      .map((cal) => Number(cal.pout_tee_amount))
      .reduce((pre, next) => pre + next, 0);
    const totalAmount = memCalls
      .map((cal) => Number(cal.totalAmount))
      .reduce((pre, next) => pre + next, 0);

    const totalCommission = memCalls
      .map((cal) => Number(cal.commission))
      .reduce((pre, next) => pre + next, 0);

    const totalWin = memCalls
      .map((cal) => Number(cal.win))
      .reduce((pre, next) => pre + next, 0);

    result[key] = {
      member: rs.member,
      totalAmount,
      pout_tee_amount,
      totalCommission,
      totalWin,
      callLists: memCalls,
    };
  });

  console.log(result);

  res.status(200).json({ success: true, report: result });
});

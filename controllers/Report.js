const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const Lager = require("../models/Lager");
const Call = require("../models/Call");
const User = require("../models/User");
const Lottery = require("../models/Lottery");
const OutCall = require("../models/OutCall");
const moment = require("moment");
const { filterShortCut } = require("../utils/filterCallForShortcut");

exports.membersCollections = asyncHandler(async (req, res, next) => {
  // const start = new Date();

  let { start_date, end_date, In, Out, customer, time } = await req.query;
  // console.log(start_date.toISOString())
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  // const start = "Fri Aug 19 2022 12:42:18 GMT+0630";

  // console.log(start.toISOString(), end.toISOString());
  console.log(start, end,customer,time);

  // console.log(JSON.parse(queryStr));

  var memberReport = [];

  // const lager = await Lager.find({ user: req.user._id });
  let calls;
  let members;

  const query = await User.find({ createByUser: req.user._id });
  if (customer === "All") {
    members = query;
  } else if (customer !== "All") {
    members = query.filter((q) => q._id.toString() === customer);
  }
  // members = query;
  // members = query;
  // console.log(members);

  if (req.user.role === "Admin") {
    // console.log(Date(start), Date(end));
    const query = await Call.find({
      user: req.user._id,
      master: members.map((m) => m._id),
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    console.log(query);
    if (time === "All") {
      calls = query;
    } else if (time !== "All") {
      console.log(time);
      const lots = await Lottery.find({
        _time: time,
        betTime: {
          $gte: start,
          $lte: end,
        },
      });
      // console.log(lots);
      calls = query.filter((q) =>
        lots.map((l) => l._id.toString()).includes(q.lottery.toString())
      );
    }
  }

  if (req.user.role === "Master") {
    const query = await Call.find({
      user: req.user._id,
      agent: members.map((m) => m._id),
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    // console.log(query);
    if (time === "All") {
      calls = query;
    } else if (time !== "All") {
      console.log(time);
      const lots = await Lottery.find({
        _time: time,
        betTime: {
          $gte: start,
          $lte: end,
        },
      });
      // console.log(lots);
      calls = query.filter((q) =>
        lots.map((l) => l._id.toString()).includes(q.lottery.toString())
      );
    }
  }
  if (req.user.role === "Agent") {
    calls = await Call.find({
      user: req.user._id,
      customer: members.map((m) => m._id),
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    if (time === "All") {
      calls = query;
    } else if (time !== "All") {
      console.log(time);
      const lots = await Lottery.find({
        _time: time,
        betTime: {
          $gte: start,
          $lte: end,
        },
      });
      // console.log(lots);
      calls = query.filter((q) =>
        lots.map((l) => l._id.toString()).includes(q.lottery.toString())
      );
    }
  }

  // console.log(calls);

  // .populate({ path: "user", select: "username name role" })
  // .populate({ path: "agent", select: "username name role" });
  if (!calls.length) {
    return next(new ErrorResponse(`Reports not found`, 404));
  }
  members.map((m) => {
    console.log(m._id);
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
      memId: m._id,
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

  // if(customer!=='All'){
  //  const mem = memberReport.filter(mem=>mem.memId.toString()!==customer)
  //  console.log(mem)
  // }else{
  //   const
  // }

  // console.log(memberReport)

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

  // console.log(colors.bgGreen(report));

  res.status(200).json({
    success: true,
    report,
    // data: IN,
    // report: { totalAmount, totalWin, totalCommission },

    url: req.originalUrl,
  });
});

exports.outCollections = asyncHandler(async (req, res, next) => {
  let { start_date, end_date, time } = await req.query;
  // console.log(start_date.toISOString())
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  console.log(start, end, req.user.id);

  const query = await OutCall.find({
    user: req.user._id,
    betTime: {
      $gte: start,
      $lte: end,
    },
  }).populate({
    path: "customer",
    select: "username name commission",
  });
  console.log(colors.bgCyan(query));
  let calls;
  if (time == "All") {
    calls = query;
    console.log("all");
  } else {
    const lots = await Lottery.find({
      _time: time,
      betTime: {
        $gte: start,
        $lte: end,
      },
    });
    console.log(lots);
    calls = query.filter((q) =>
      lots.map((l) => l._id.toString()).includes(q.lottery.toString())
    );
  }

  console.log(calls);

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

  // console.log(time);
  const totalOut = {
    pout_tee_amount,
    totalAmount,
    totalCommission,
    totalWin,
  };
  const report = { calls, totalOut };
  console.log(report);

  res.status(200).json({ success: true, out: "this is out data", report });
});

exports.mainCollections = asyncHandler(async (req, res, next) => {
  let { start_date, end_date, time } = await req.query;
  // console.log(start_date.toISOString())
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  const query = await Lager.find({
    user: req.user._id,
    _date: {
      $gte: start,
      $lte: end,
    },
  }).populate({
    path: "user",
    select: "username name",
  });

  let main;
  if (time == "All") {
    main = query;
    console.log("all");
  } else {
    main = query.filter((q) => q._time.toString() === time.toString());
  }

  console.log(main);

  const pout_tee_amount = main
    .map((cal) => Number(cal.pout_tee_amount))
    .reduce((pre, next) => pre + next, 0);
  const totalAmount = main
    .map((cal) => Number(cal.totalAmount))
    .reduce((pre, next) => pre + next, 0);

  // const totalCommission = main
  //   .map((cal) => Number(cal.commission))
  //   .reduce((pre, next) => pre + next, 0);

  const totalWin = main
    .map((cal) => Number(cal.win))
    .reduce((pre, next) => pre + next, 0);

  // console.log(time);
  const totalMain = {
    pout_tee_amount,
    totalAmount,
    totalWin,
  };

  const report = { main, totalMain };
  console.log(report);

  res.status(200).json({ success: true, out: "this is main data", report });
});

exports.daily = asyncHandler(async (req, res, next) => {
  let { start_date, end_date, _time } = await req.query;
  const start = moment(new Date(start_date)).format("YYYY-MM-DD");
  const end = moment(new Date(end_date)).format("YYYY-MM-DD");

  console.log(_time);
  // const members = await User.find({ createByUser: req.user._id });
  const lotteries = await Lottery.find({
    _time: _time,
    _date: {
      $gte: start,
      $lte: end,
    },
  });
  console.log(lotteries);
  const calls = await Call.find({
    user: req.user._id,
    betTime: {
      $gte: start,
      $lte: end,
    },
  });
  const daily = [];
  lotteries.map((l) => {
    console.log(colors.bgGreen(l.betTime));
    const c = calls.filter(
      (cal) => cal.lottery.toString() === l._id.toString()
    );
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
    if (c.length) {
      daily.push({
        date: moment(l._date).format("YYYY-MM-DD"),
        totalAmount,
        pout_tee_amount,
        totalCommission,
        totalWin,
      });
    }
  });

  console.log(start, end);

  console.log(daily);
  res.status(200).json({ success: true, report: daily });
});

exports.dailyMembers = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  console.log(date);
  // const { lager } = req.query;
  // // const ldate = new Date(date);
  // // console.log(ldate.toISOString());
  // const lagers = await Lager.findById(lager);

  const calls = filterShortCut(
    await Call.find({ betTime: date })
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
      })
  );
  console.log(calls);
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
  // c.map((cl) => result.push({ member: cl }));
  c.forEach((cal) => {
    if (cal !== undefined) result.push(cal);
  });
  console.log(colors.bgBlue(result));

  // const demo = [...result];
  result.map((rs, key) => {
    console.log(calls, rs._id);
    let memCalls;
    if (req.user.role === "Admin") {
      memCalls = calls.filter((cal) => cal.master && cal.master._id === rs._id);
    }
    if (req.user.role === "Master") {
      memCalls = calls.filter((cal) => cal.agent && cal.agent._id === rs._id);
    }
    if (req.user.role === "Agent") {
      memCalls = calls.filter(
        (cal) => cal.customer && cal.customer._id === rs._id
      );
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
      member: rs,
      totalAmount,
      pout_tee_amount,
      totalCommission,
      totalWin,
      callLists: memCalls,
    };
  });

  // console.log(result);

  res.status(200).json({ success: true, report: result });
});

exports.memberDetails = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, report: "this is member details" });
});
